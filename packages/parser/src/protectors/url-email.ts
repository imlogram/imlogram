import type { Protector, ProtectorMatch } from "../types.js";

// Trailing punctuation (. , ; : ! ? ) ) commonly follows a URL in prose and is not
// part of it, so it is trimmed off the match.
const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"'()]+/g;
const TRAILING_PUNCT_RE = /[.,;:!?)'"]+$/;
const EMAIL_RE = /\b[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

export const urlProtector: Protector = (text) => {
  const matches: ProtectorMatch[] = [];
  for (const m of text.matchAll(URL_RE)) {
    let raw = m[0];
    let end = m.index + raw.length;
    const trimMatch = TRAILING_PUNCT_RE.exec(raw);
    if (trimMatch) end -= trimMatch[0].length;
    matches.push({ kind: "url", start: m.index, end });
  }
  return matches;
};

export const emailProtector: Protector = (text) => {
  const matches: ProtectorMatch[] = [];
  for (const m of text.matchAll(EMAIL_RE)) {
    matches.push({ kind: "email", start: m.index, end: m.index + m[0].length });
  }
  return matches;
};
