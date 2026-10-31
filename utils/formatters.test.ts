import { describe, expect, it } from "vitest";
import { formatDuration } from "./formatters";

describe("formatDuration", () => {
  it.each([
    [45, "45 min"],
    [60, "1 h"],
    [90, "1 h 30 min"],
    [240, "4 h"],
  ])("%i minutes read %s", (minutes, text) => {
    expect(formatDuration(minutes)).toBe(text);
  });
});
