import { describe, expect, it } from "vitest";
import { notificationHref } from "@/features/notifications/lib/notificationHref";
import type { ChatMessage } from "./types";
import { conversationItem, mergeMessages, startsNewDay } from "./utils";

const message = (id: number, createdAt = "2026-10-13T10:00:00Z"): ChatMessage => ({
  id,
  conversationId: 7,
  senderId: "s1",
  kind: "TEXT",
  body: `m${id}`,
  masked: false,
  mine: false,
  createdAt,
});

describe("conversationItem", () => {
  it("links to the item's own page in its catalogue", () => {
    const item = { id: 12, name: "Bicicleta", images: [] as string[] };
    expect(
      conversationItem(
        { itemType: "PRODUCT", product: item, storeProduct: null, service: null },
        "es",
      ),
    ).toMatchObject({ name: "Bicicleta", href: "/es/product/12" });
    expect(
      conversationItem(
        { itemType: "SERVICE", product: null, storeProduct: null, service: item },
        "en",
      ),
    ).toMatchObject({ href: "/en/service/12" });
  });

  it("is null when the item is gone", () => {
    expect(
      conversationItem(
        { itemType: "STORE_PRODUCT", product: null, storeProduct: null, service: null },
        "es",
      ),
    ).toBeNull();
  });
});

describe("mergeMessages", () => {
  it("keeps each message once, oldest first", () => {
    const merged = mergeMessages([message(1), message(3)], [message(3), message(2)]);
    expect(merged.map((m) => m.id)).toEqual([1, 2, 3]);
  });
});

describe("startsNewDay", () => {
  it("labels the first message and each change of day", () => {
    const first = message(1, "2026-10-12T10:00:00Z");
    const sameDay = message(2, "2026-10-12T11:00:00Z");
    const nextDay = message(3, "2026-10-14T09:00:00Z");
    expect(startsNewDay(undefined, first)).toBe(true);
    expect(startsNewDay(first, sameDay)).toBe(false);
    expect(startsNewDay(sameDay, nextDay)).toBe(true);
  });
});

describe("message notifications", () => {
  it("open their own thread", () => {
    expect(
      notificationHref({ type: "MESSAGE_RECEIVED", relatedId: "conversation:7" }, "es"),
    ).toBe("/es/profile/messages?c=7");
    expect(notificationHref({ type: "MESSAGE_RECEIVED", relatedId: null }, "es")).toBe(
      "/es/profile/messages",
    );
  });
});
