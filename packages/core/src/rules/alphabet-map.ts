/**
 * New → old is a pure bijective table lookup (no ambiguity, see docs/spec/09).
 * Uppercase digraph output collapses SH and Sh both to "Sh" on the way back —
 * that direction is inherently lossy for ALL-CAPS input, which is expected.
 */
export const NEW_TO_OLD_DIGRAPH: ReadonlyMap<string, string> = new Map([
  ["ş", "sh"],
  ["ç", "ch"],
]);

export const NEW_TO_OLD_APOSTROPHE: ReadonlyMap<string, string> = new Map([
  ["ö", "o"],
  ["ğ", "g"],
]);

/** Old → new digraphs. Applied only when the word is not in the exception list. */
export const OLD_TO_NEW_DIGRAPH: ReadonlyMap<string, string> = new Map([
  ["sh", "ş"],
  ["ch", "ç"],
]);

export const OLD_TO_NEW_APOSTROPHE: ReadonlyMap<string, string> = new Map([
  ["o", "ö"],
  ["g", "ğ"],
]);
