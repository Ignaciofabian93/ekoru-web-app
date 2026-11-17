import type { TermsDocument } from "../api/getCurrentTerms";

export type ClausePart =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "subclause"; title: string; parts: ClausePart[] };

export interface Clause {
  id: string;
  number: string;
  label: string;
  /** Has a list or sub-clauses: shown in the accent tone, as before. */
  structured: boolean;
  parts: ClausePart[];
}

/**
 * Turns the API's flat blocks into clause cards: each HEADING opens a clause,
 * each SUBHEADING a sub-clause inside it, and consecutive LIST_ITEMs form one
 * list. Text before the first heading becomes an untitled clause.
 */
export function groupClauses(blocks: TermsDocument["blocks"]): Clause[] {
  const clauses: Clause[] = [];
  // Where paragraphs and lists go: the clause, or its open sub-clause.
  let target: ClausePart[] = [];

  const open = (title: string): Clause => {
    const { number, label } = splitClauseNumber(title);
    // Anchored by the clause's own number (#clause-6 is the privacy notice),
    // so links survive clauses being added or reordered; by position otherwise.
    const id = `clause-${number || `n${clauses.length + 1}`}`;
    const clause: Clause = {
      id: clauses.some((c) => c.id === id) ? `${id}-${clauses.length + 1}` : id,
      number,
      label,
      structured: false,
      parts: [],
    };
    clauses.push(clause);
    target = clause.parts;
    return clause;
  };

  for (const block of blocks) {
    if (block.kind === "HEADING") {
      open(block.text);
      continue;
    }
    const clause = clauses[clauses.length - 1] ?? open("");
    if (block.kind === "SUBHEADING") {
      const sub: ClausePart = { kind: "subclause", title: block.text, parts: [] };
      clause.parts.push(sub);
      clause.structured = true;
      target = sub.parts;
    } else if (block.kind === "LIST_ITEM") {
      const last = target[target.length - 1];
      if (last?.kind === "list") last.items.push(block.text);
      else target.push({ kind: "list", items: [block.text] });
      clause.structured = true;
    } else {
      target.push({ kind: "paragraph", text: block.text });
    }
  }
  return clauses;
}

/**
 * Splits "3. Platform Use" into the marker and the heading, so the number can
 * ride in the card's chip without being repeated in the title beside it. The
 * number is read from the text because the text is what's legally
 * authoritative.
 */
export function splitClauseNumber(title: string): { number: string; label: string } {
  const match = /^\s*(\d+(?:\.\d+)*)\.?\s+(.*)$/.exec(title);
  if (!match) return { number: "", label: title };
  return { number: match[1], label: match[2] };
}
