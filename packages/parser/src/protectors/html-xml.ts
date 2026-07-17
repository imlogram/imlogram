import type { Protector, ProtectorMatch } from "../types.js";

// Matches tags, comments, doctype and CDATA. Deliberately permissive (attribute
// values, including code-like identifiers such as `class="ShoppingCart"`, are
// protected wholesale together with the tag).
const HTML_TAG_RE = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][a-zA-Z0-9:_-]*(?:\s+[^<>]*?)?\/?>/g;
const HTML_ENTITY_RE = /&(?:[a-zA-Z][a-zA-Z0-9]*|#[0-9]+|#x[0-9a-fA-F]+);/g;

export const htmlTagProtector: Protector = (text) => {
  const matches: ProtectorMatch[] = [];
  for (const m of text.matchAll(HTML_TAG_RE)) {
    matches.push({ kind: "html-tag", start: m.index, end: m.index + m[0].length });
  }
  return matches;
};

export const htmlEntityProtector: Protector = (text) => {
  const matches: ProtectorMatch[] = [];
  for (const m of text.matchAll(HTML_ENTITY_RE)) {
    matches.push({ kind: "html-entity", start: m.index, end: m.index + m[0].length });
  }
  return matches;
};
