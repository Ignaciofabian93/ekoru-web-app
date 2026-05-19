import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  process.env.GRAPHQL_URL ??
  "http://localhost:4000/graphql";

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

const errorLink = onError(({ error, operation }) => {
  console.error(`[Apollo error] Operation: ${operation.operationName}`, error);
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("ekoru_token="))
          ?.split("=")[1]
      : undefined;

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

let browserClient: ApolloClient | undefined;

function makeClient() {
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
    },
  });
}

export function getApolloClient() {
  if (typeof window === "undefined") {
    return makeClient();
  }
  if (!browserClient) {
    browserClient = makeClient();
  }
  return browserClient;
}
