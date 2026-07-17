import { frontMatterProtector } from "./protectors/front-matter.js";
import { codeBlockProtector, inlineCodeProtector } from "./protectors/code-block.js";
import { htmlTagProtector, htmlEntityProtector } from "./protectors/html-xml.js";
import { urlProtector, emailProtector } from "./protectors/url-email.js";
import type { Protector, ProtectorMatch, Segment } from "./types.js";

// Priority order matters: earlier protectors win when spans overlap (e.g. a URL
// inside an href="..." attribute is already covered by the html-tag match).
const PROTECTORS: Protector[] = [
  frontMatterProtector,
  codeBlockProtector,
  inlineCodeProtector,
  htmlTagProtector,
  htmlEntityProtector,
  urlProtector,
  emailProtector,
];

function resolveOverlaps(matches: ProtectorMatch[]): ProtectorMatch[] {
  const sorted = [...matches].sort((a, b) => a.start - b.start || b.end - a.end);
  const accepted: ProtectorMatch[] = [];
  let cursor = -1;
  for (const m of sorted) {
    if (m.start < cursor) continue; // overlaps a higher-priority match already accepted
    if (m.end <= m.start) continue;
    accepted.push(m);
    cursor = m.end;
  }
  return accepted;
}

export function segment(text: string): Segment[] {
  const allMatches = PROTECTORS.flatMap((protector) => protector(text));
  const accepted = resolveOverlaps(allMatches);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const m of accepted) {
    if (m.start > cursor) {
      segments.push({ kind: "text", raw: text.slice(cursor, m.start), start: cursor, end: m.start });
    }
    segments.push({ kind: m.kind, raw: text.slice(m.start, m.end), start: m.start, end: m.end });
    cursor = m.end;
  }
  if (cursor < text.length) {
    segments.push({ kind: "text", raw: text.slice(cursor), start: cursor, end: text.length });
  }
  if (segments.length === 0) {
    segments.push({ kind: "text", raw: text, start: 0, end: text.length });
  }
  return segments;
}
