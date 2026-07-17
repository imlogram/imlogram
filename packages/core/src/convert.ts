import { segment, segmentSourceCode, isUpper, applySingleCharCase, type Segment, type SegmentKind } from "@imlogram/parser";
import {
  NEW_TO_OLD_DIGRAPH,
  NEW_TO_OLD_APOSTROPHE,
  OLD_TO_NEW_DIGRAPH,
  OLD_TO_NEW_APOSTROPHE,
} from "./rules/alphabet-map.js";
import { APOSTROPHE_VARIANTS, APOSTROPHE_VARIANT_SET, CANONICAL_APOSTROPHE } from "./rules/apostrophe-variants.js";
import { isDigraphException } from "./rules/exceptions.js";
import type { Change, ConversionDirection, ConversionOptions, ConversionResult } from "./types.js";

const WORD_RE = new RegExp(`[\\p{L}][\\p{L}${APOSTROPHE_VARIANTS.join("")}]*`, "gu");

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

function convertWordOldToNew(word: string, wordOffset: number, changes: Change[]): string {
  const exempt = isDigraphException(word.toLowerCase());
  let out = "";
  let i = 0;
  while (i < word.length) {
    const c = word[i];
    const cLower = c.toLowerCase();
    const next: string | undefined = word[i + 1];

    if ((cLower === "o" || cLower === "g") && next && APOSTROPHE_VARIANT_SET.has(next)) {
      const repl = applySingleCharCase(OLD_TO_NEW_APOSTROPHE.get(cLower)!, c);
      changes.push({ start: wordOffset + i, end: wordOffset + i + 2, from: c + next, to: repl, reason: "apostrophe" });
      out += repl;
      i += 2;
      continue;
    }

    if (next) {
      const two = cLower + next.toLowerCase();
      const digraphRepl = OLD_TO_NEW_DIGRAPH.get(two);
      if (digraphRepl) {
        if (exempt) {
          changes.push({ start: wordOffset + i, end: wordOffset + i + 2, from: c + next, to: c + next, reason: "exception-skip" });
        } else {
          const repl = applySingleCharCase(digraphRepl, c);
          changes.push({ start: wordOffset + i, end: wordOffset + i + 2, from: c + next, to: repl, reason: "digraph" });
          out += repl;
          i += 2;
          continue;
        }
      }
    }

    out += c;
    i += 1;
  }
  return out;
}

function convertTextOldToNew(raw: string, baseOffset: number): { text: string; changes: Change[] } {
  const changes: Change[] = [];
  let out = "";
  let cursor = 0;
  for (const m of raw.matchAll(WORD_RE)) {
    const start = m.index!;
    if (start > cursor) out += raw.slice(cursor, start);
    out += convertWordOldToNew(m[0], baseOffset + start, changes);
    cursor = start + m[0].length;
  }
  if (cursor < raw.length) out += raw.slice(cursor);
  return { text: out, changes };
}

function convertTextNewToOld(raw: string, baseOffset: number): { text: string; changes: Change[] } {
  const changes: Change[] = [];
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const lower = c.toLowerCase();

    const digraphRepl = NEW_TO_OLD_DIGRAPH.get(lower);
    if (digraphRepl) {
      const replaced = isUpper(c) ? capitalize(digraphRepl) : digraphRepl;
      changes.push({ start: baseOffset + i, end: baseOffset + i + 1, from: c, to: replaced, reason: "digraph" });
      out += replaced;
      continue;
    }

    const apostropheRepl = NEW_TO_OLD_APOSTROPHE.get(lower);
    if (apostropheRepl) {
      const baseLetter = isUpper(c) ? apostropheRepl.toUpperCase() : apostropheRepl;
      const replaced = baseLetter + CANONICAL_APOSTROPHE;
      changes.push({ start: baseOffset + i, end: baseOffset + i + 1, from: c, to: replaced, reason: "apostrophe" });
      out += replaced;
      continue;
    }

    out += c;
  }
  return { text: out, changes };
}

export function shouldProtect(kind: SegmentKind, options: Required<ConversionOptions>): boolean {
  switch (kind) {
    case "text":
      return false;
    case "front-matter":
      return true;
    case "code-block":
    case "inline-code":
      return options.protectCode;
    case "html-tag":
    case "html-entity":
      return options.protectHtml;
    case "url":
    case "email":
      return options.protectUrls;
    default:
      return true;
  }
}

export function resolveOptions(options: ConversionOptions): Required<ConversionOptions> {
  return {
    protectUrls: options.protectUrls ?? true,
    protectCode: options.protectCode ?? true,
    protectHtml: options.protectHtml ?? true,
  };
}

function countWords(text: string): number {
  return [...text.matchAll(WORD_RE)].length;
}

type SegmentConverter = (raw: string, offset: number) => { text: string; changes: Change[] };

export function buildResult(
  segments: Segment[],
  direction: ConversionDirection,
  isProtected: (kind: SegmentKind) => boolean,
  convertSegment: SegmentConverter,
): ConversionResult {
  let text = "";
  const changes: Change[] = [];

  for (const seg of segments) {
    if (isProtected(seg.kind)) {
      text += seg.raw;
      continue;
    }
    const { text: convertedText, changes: segChanges } = convertSegment(seg.raw, seg.start);
    text += convertedText;
    changes.push(...segChanges);
  }

  const realChanges = changes.filter((c) => c.reason !== "exception-skip");
  const wordCount = countWords(text);

  return {
    text,
    direction,
    changes: realChanges,
    stats: {
      charCount: [...text].length,
      wordCount,
      changedCount: realChanges.length,
      readingTimeSec: Math.max(1, Math.round((wordCount / 200) * 60)),
    },
  };
}

export function convertToNew(input: string, options: ConversionOptions = {}): ConversionResult {
  const resolved = resolveOptions(options);
  const segments = segment(input);
  return buildResult(segments, "old_to_new", (kind) => shouldProtect(kind, resolved), convertTextOldToNew);
}

export function convertToOld(input: string, options: ConversionOptions = {}): ConversionResult {
  const resolved = resolveOptions(options);
  const segments = segment(input);
  return buildResult(segments, "new_to_old", (kind) => shouldProtect(kind, resolved), convertTextNewToOld);
}

/**
 * Converts natural-language UI text embedded in a JS/TS/JSX/TSX source file —
 * string literals and JSX text nodes — while leaving identifiers, keywords,
 * imports, JSX tags/attributes, and Tailwind-shaped class strings untouched.
 * See packages/parser/src/source-code.ts for how convertible spans are told
 * apart from code.
 *
 * Deliberately has no ConversionOptions: protection of code structure here is
 * not optional the way markdown-code-fence protection is in prose mode.
 */
export function convertCodeToNew(sourceCode: string): ConversionResult {
  return buildResult(segmentSourceCode(sourceCode), "old_to_new", (kind) => kind !== "text", convertTextOldToNew);
}

export function convertCodeToOld(sourceCode: string): ConversionResult {
  return buildResult(segmentSourceCode(sourceCode), "new_to_old", (kind) => kind !== "text", convertTextNewToOld);
}
