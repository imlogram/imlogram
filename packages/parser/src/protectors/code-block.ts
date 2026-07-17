import type { Protector, ProtectorMatch } from "../types.js";

const FENCED_CODE_RE = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;
const INLINE_CODE_RE = /`[^`\n]+`/g;

export const codeBlockProtector: Protector = (text) => {
  const matches: ProtectorMatch[] = [];
  for (const m of text.matchAll(FENCED_CODE_RE)) {
    matches.push({ kind: "code-block", start: m.index, end: m.index + m[0].length });
  }
  return matches;
};

export const inlineCodeProtector: Protector = (text) => {
  const matches: ProtectorMatch[] = [];
  for (const m of text.matchAll(INLINE_CODE_RE)) {
    matches.push({ kind: "inline-code", start: m.index, end: m.index + m[0].length });
  }
  return matches;
};
