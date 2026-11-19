import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import en from "../i18n/locales/en.json";
import { NAMESPACE } from "../i18n";
import { TagsField } from "../ui/fields/TagsField";

function renderField() {
  const onChange = vi.fn();
  render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: en }}>
      <TagsField value={[]} onChange={onChange} />
    </DictionaryProvider>,
  );
  const input = screen.getByRole("textbox", { name: en.form.tags });
  fireEvent.change(input, { target: { value: "eco" } });
  return { input, onChange };
}

describe("TagsField", () => {
  it.each(["Enter", ","])("adds the tag on %s", (key) => {
    const { input, onChange } = renderField();

    const notPrevented = fireEvent.keyDown(input, { key });

    expect(onChange).toHaveBeenCalledWith(["eco"]);
    expect(notPrevented).toBe(false);
  });

  describe("while an IME is composing (Japanese, Chinese, Korean)", () => {
    it.each([
      ["isComposing", { isComposing: true }],
      ["Safari's 229 key code", { keyCode: 229 }],
    ])("leaves the confirming Enter to the IME (%s)", (_, ime) => {
      const { input, onChange } = renderField();

      const notPrevented = fireEvent.keyDown(input, { key: "Enter", ...ime });

      expect(onChange).not.toHaveBeenCalled();
      // Still cancelled, so it can't submit the surrounding form.
      expect(notPrevented).toBe(false);
    });

    it("lets the comma through to the IME", () => {
      const { input, onChange } = renderField();

      const notPrevented = fireEvent.keyDown(input, { key: ",", isComposing: true });

      expect(onChange).not.toHaveBeenCalled();
      expect(notPrevented).toBe(true);
    });
  });
});
