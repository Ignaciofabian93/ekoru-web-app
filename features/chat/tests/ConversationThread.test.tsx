import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import type { ChatConversation } from "../types";
import en from "../i18n/locales/en.json";
import { NAMESPACE } from "../i18n";
import { ConversationThread } from "../ui/ConversationThread";

const thread = vi.hoisted(() => ({
  send: vi.fn(),
}));

const conversation = {
  id: 7,
  itemType: "PRODUCT",
  myRole: "BUYER",
  status: "OPEN",
  blockedByMe: false,
  unreadCount: 0,
  lastMessageAt: "2026-11-18T12:00:00.000Z",
  createdAt: "2026-11-18T12:00:00.000Z",
  lastMessage: null,
  counterpart: { id: "s1", email: "ana@example.com", profile: null },
  product: null,
  storeProduct: null,
  service: null,
  contactAllowed: true,
} as unknown as ChatConversation;

vi.mock("../hooks/useConversationThread", () => ({
  useConversationThread: () => ({
    conversation,
    messages: [],
    loaded: true,
    hasMore: false,
    sending: false,
    error: null,
    send: thread.send,
    loadOlder: vi.fn(),
    setBlocked: vi.fn(),
    report: vi.fn(),
  }),
}));

function renderThread() {
  render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: en }}>
      <ConversationThread conversationId={7} lang="en" />
    </DictionaryProvider>,
  );
  const composer = screen.getByRole("textbox", { name: en.composer.label });
  fireEvent.change(composer, { target: { value: "こんにちは" } });
  return composer;
}

beforeEach(() => {
  thread.send.mockReset().mockResolvedValue(true);
});

describe("ConversationThread composer", () => {
  it("sends on Enter", () => {
    const composer = renderThread();

    const notPrevented = fireEvent.keyDown(composer, { key: "Enter" });

    expect(thread.send).toHaveBeenCalledWith("こんにちは");
    expect(notPrevented).toBe(false);
  });

  it("keeps Shift+Enter for a new line", () => {
    const composer = renderThread();

    const notPrevented = fireEvent.keyDown(composer, { key: "Enter", shiftKey: true });

    expect(thread.send).not.toHaveBeenCalled();
    expect(notPrevented).toBe(true);
  });

  it.each([
    ["isComposing", { isComposing: true }],
    ["Safari's 229 key code", { keyCode: 229 }],
  ])("does not send on the Enter that confirms an IME candidate (%s)", (_, ime) => {
    const composer = renderThread();

    const notPrevented = fireEvent.keyDown(composer, { key: "Enter", ...ime });

    expect(thread.send).not.toHaveBeenCalled();
    // No stray newline either.
    expect(notPrevented).toBe(false);
  });
});
