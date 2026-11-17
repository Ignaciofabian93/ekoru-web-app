import { describe, expect, it } from "vitest";
import { groupClauses } from "./groupClauses";

describe("groupClauses", () => {
  it("builds clause cards with lists and sub-clauses, anchored by clause number", () => {
    const clauses = groupClauses([
      { kind: "HEADING", text: "1. Introducción" },
      { kind: "PARAGRAPH", text: "Uno." },
      { kind: "HEADING", text: "2. Definiciones" },
      { kind: "PARAGRAPH", text: "Se entiende por:" },
      { kind: "LIST_ITEM", text: "Plataforma" },
      { kind: "LIST_ITEM", text: "Usuario" },
      { kind: "HEADING", text: "6. Privacidad" },
      { kind: "SUBHEADING", text: "6.1 Qué datos tratamos" },
      { kind: "PARAGRAPH", text: "Nombre y correo." },
    ]);

    expect(clauses.map((c) => [c.id, c.number, c.label, c.structured])).toEqual([
      ["clause-1", "1", "Introducción", false],
      ["clause-2", "2", "Definiciones", true],
      ["clause-6", "6", "Privacidad", true],
    ]);
    expect(clauses[1]?.parts).toEqual([
      { kind: "paragraph", text: "Se entiende por:" },
      { kind: "list", items: ["Plataforma", "Usuario"] },
    ]);
    expect(clauses[2]?.parts).toEqual([
      {
        kind: "subclause",
        title: "6.1 Qué datos tratamos",
        parts: [{ kind: "paragraph", text: "Nombre y correo." }],
      },
    ]);
  });

  it("keeps text before the first title in an untitled clause", () => {
    const [first] = groupClauses([{ kind: "PARAGRAPH", text: "Preámbulo." }]);
    expect(first).toMatchObject({ id: "clause-n1", number: "", label: "" });
  });
});
