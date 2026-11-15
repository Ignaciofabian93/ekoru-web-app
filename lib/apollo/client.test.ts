import { ApolloClient, ApolloLink, InMemoryCache, gql } from "@apollo/client";
import { of } from "rxjs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { errorLink } from "./client";
import { isUnauthorizedError } from "./errors";

/**
 * GW-8: when the access token runs out with several queries on screen, they
 * must share one `/api/auth/refresh`; a second renewal with the same cookie is
 * refused by the gateway and signed parts of the screen out.
 */

const QUERIES = ["A", "B", "C"].map((name) => ({
  name,
  query: gql(`query Badge${name} { count${name} }`),
}));

/** Answers UNAUTHORIZED to each operation's first try, data after that. */
function expiringServer() {
  const tries = new Map<string, number>();
  return new ApolloLink((operation) => {
    const n = (tries.get(operation.operationName ?? "") ?? 0) + 1;
    tries.set(operation.operationName ?? "", n);
    if (n === 1) {
      return of({
        errors: [
          { message: "Debe iniciar sesión", extensions: { code: "UNAUTHORIZED" } },
        ],
      });
    }
    const field = `count${(operation.operationName ?? "").replace("Badge", "")}`;
    return of({ data: { [field]: n } });
  });
}

function stubRefresh(status: number) {
  const fetchMock = vi.fn(
    () =>
      new Promise<Response>((resolve) =>
        // Still running while the other queries fail.
        setTimeout(() => resolve(new Response(null, { status })), 20),
      ),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function makeClient() {
  return new ApolloClient({
    link: errorLink.concat(expiringServer()),
    cache: new InMemoryCache(),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Apollo session renewal (GW-8)", () => {
  it("renews once for three queries that fail at the same time, and retries each", async () => {
    const fetchMock = stubRefresh(200);
    const client = makeClient();

    const results = await Promise.all(
      QUERIES.map(({ query }) => client.query({ query, fetchPolicy: "network-only" })),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    expect(results.map((r) => r.data)).toEqual([
      { countA: 2 },
      { countB: 2 },
      { countC: 2 },
    ]);
  });

  it("reports all three as signed out when the one renewal fails", async () => {
    const fetchMock = stubRefresh(401);
    const client = makeClient();

    const settled = await Promise.allSettled(
      QUERIES.map(({ query }) => client.query({ query, fetchPolicy: "network-only" })),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    for (const result of settled) {
      expect(result.status).toBe("rejected");
      if (result.status === "rejected")
        expect(isUnauthorizedError(result.reason)).toBe(true);
    }
  });

  it("starts a fresh renewal once the previous one has finished", async () => {
    const fetchMock = stubRefresh(200);

    await makeClient().query({ query: QUERIES[0].query, fetchPolicy: "network-only" });
    await makeClient().query({ query: QUERIES[1].query, fetchPolicy: "network-only" });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
