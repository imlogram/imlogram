import type { Protector, ProtectorMatch } from "../types.js";

const FRONT_MATTER_RE = /^---\r?\n[\s\S]*?\r?\n---(\r?\n|$)/;

export const frontMatterProtector: Protector = (text) => {
  const match = FRONT_MATTER_RE.exec(text);
  if (!match || match.index !== 0) return [];
  const m: ProtectorMatch = { kind: "front-matter", start: 0, end: match[0].length };
  return [m];
};
