import { segment, isUpper } from "@imlogram/parser";
import {
  CYRILLIC_VOWELS,
  IOTATED_BASE,
  CYRILLIC_TO_LATIN_SIMPLE,
  LATIN_TO_CYRILLIC_SIMPLE,
} from "./rules/cyrillic-map.js";
import { APOSTROPHE_VARIANTS, APOSTROPHE_VARIANT_SET } from "./rules/apostrophe-variants.js";
import { isDigraphException } from "./rules/exceptions.js";
import { resolveOptions, shouldProtect, buildResult } from "./convert.js";
import type { Change, ConversionOptions, ConversionResult } from "./types.js";

// Cyrillic ъ/ь are already Unicode "Letter" characters, so a plain \p{L}+ run
// groups them with the rest of a word correctly.
const CYRILLIC_WORD_RE = /\p{L}+/gu;
// Most apostrophe variants (ASCII ', curly quotes, grave accent, ...) are
// Unicode *punctuation*, not letters — \p{L}+ alone would split "go'zal"
// into "go" and an orphaned "'zal", never reaching the o'/g' digraph check
// below. This mirrors the word regex used for old->new in convert.ts.
const LATIN_WORD_RE = new RegExp(`[\\p{L}][\\p{L}${APOSTROPHE_VARIANTS.join("")}]*`, "gu");
const LATIN_VOWELS: ReadonlySet<string> = new Set(["a", "o", "u", "e", "i", "ö"]);
const Y_VOWEL_TARGET: Readonly<Record<string, string>> = { a: "я", o: "ё", u: "ю", e: "е" };
const OLD_APOSTROPHE_TO_CYRILLIC: Readonly<Record<string, string>> = { o: "ў", g: "ғ" };
const OLD_DIGRAPH_TO_CYRILLIC: Readonly<Record<string, string>> = { sh: "ш", ch: "ч" };

function applyMultiCharCase(repl: string, sourceChar: string): string {
  if (repl.length === 0) return repl;
  if (!isUpper(sourceChar)) return repl.toLowerCase();
  return repl.length === 1 ? repl.toUpperCase() : repl[0].toUpperCase() + repl.slice(1);
}

function convertWordCyrillicToLatin(word: string, wordOffset: number, changes: Change[]): string {
  let out = "";
  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    const lower = c.toLowerCase();

    const iotatedBase = IOTATED_BASE.get(lower);
    if (iotatedBase !== undefined) {
      const prev = i > 0 ? word[i - 1].toLowerCase() : null;
      const needsY = i === 0 || (prev !== null && CYRILLIC_VOWELS.has(prev));
      const repl = applyMultiCharCase(needsY ? "y" + iotatedBase : iotatedBase, c);
      changes.push({ start: wordOffset + i, end: wordOffset + i + 1, from: c, to: repl, reason: "digraph" });
      out += repl;
      continue;
    }

    const simple = CYRILLIC_TO_LATIN_SIMPLE.get(lower);
    if (simple !== undefined) {
      const repl = applyMultiCharCase(simple, c);
      changes.push({ start: wordOffset + i, end: wordOffset + i + 1, from: c, to: repl, reason: "digraph" });
      out += repl;
      continue;
    }

    out += c;
  }
  return out;
}

function convertWordLatinToCyrillic(word: string, wordOffset: number, changes: Change[]): string {
  // Input may be old-script ("shahar", "go'zal") or new-script ("şahar",
  // "gözal") Latin — the button just says "Latin -> Cyrillic", and a real
  // user's text is old-script at least as often as not. Recognizing both
  // here (rather than assuming new-script only) is what fixed a bug where
  // old-script "sh"/"ch"/"o'"/"g'" fell through to the plain letter table
  // and produced garbage like "сҳаҳар" for "shahar" instead of "шаҳар".
  const exempt = isDigraphException(word.toLowerCase());
  let out = "";
  let i = 0;
  while (i < word.length) {
    const c = word[i];
    const lower = c.toLowerCase();
    const next = word[i + 1];

    if ((lower === "o" || lower === "g") && next && APOSTROPHE_VARIANT_SET.has(next)) {
      const repl = applyMultiCharCase(OLD_APOSTROPHE_TO_CYRILLIC[lower], c);
      changes.push({ start: wordOffset + i, end: wordOffset + i + 2, from: c + next, to: repl, reason: "apostrophe" });
      out += repl;
      i += 2;
      continue;
    }

    if (!exempt && next) {
      const target = OLD_DIGRAPH_TO_CYRILLIC[lower + next.toLowerCase()];
      if (target) {
        const repl = applyMultiCharCase(target, c);
        changes.push({ start: wordOffset + i, end: wordOffset + i + 2, from: c + next, to: repl, reason: "digraph" });
        out += repl;
        i += 2;
        continue;
      }
    }

    if (lower === "y" && next) {
      const target = Y_VOWEL_TARGET[next.toLowerCase()];
      if (target) {
        const prev = i > 0 ? word[i - 1].toLowerCase() : null;
        const atBoundary = i === 0 || (prev !== null && LATIN_VOWELS.has(prev));
        if (atBoundary) {
          const repl = applyMultiCharCase(target, c);
          changes.push({ start: wordOffset + i, end: wordOffset + i + 2, from: c + next, to: repl, reason: "digraph" });
          out += repl;
          i += 2;
          continue;
        }
      }
    }

    if (lower === "t" && next?.toLowerCase() === "s") {
      const repl = applyMultiCharCase("ц", c);
      changes.push({ start: wordOffset + i, end: wordOffset + i + 2, from: c + next, to: repl, reason: "digraph" });
      out += repl;
      i += 2;
      continue;
    }

    if (APOSTROPHE_VARIANT_SET.has(c)) {
      changes.push({ start: wordOffset + i, end: wordOffset + i + 1, from: c, to: "ъ", reason: "apostrophe" });
      out += "ъ";
      i += 1;
      continue;
    }

    const simple = LATIN_TO_CYRILLIC_SIMPLE.get(lower);
    if (simple !== undefined) {
      const repl = applyMultiCharCase(simple, c);
      changes.push({ start: wordOffset + i, end: wordOffset + i + 1, from: c, to: repl, reason: "digraph" });
      out += repl;
      i += 1;
      continue;
    }

    out += c;
    i += 1;
  }
  return out;
}

function convertTextCyrillicToLatin(raw: string, baseOffset: number): { text: string; changes: Change[] } {
  const changes: Change[] = [];
  let out = "";
  let cursor = 0;
  for (const m of raw.matchAll(CYRILLIC_WORD_RE)) {
    const start = m.index!;
    if (start > cursor) out += raw.slice(cursor, start);
    out += convertWordCyrillicToLatin(m[0], baseOffset + start, changes);
    cursor = start + m[0].length;
  }
  if (cursor < raw.length) out += raw.slice(cursor);
  return { text: out, changes };
}

function convertTextLatinToCyrillic(raw: string, baseOffset: number): { text: string; changes: Change[] } {
  const changes: Change[] = [];
  let out = "";
  let cursor = 0;
  for (const m of raw.matchAll(LATIN_WORD_RE)) {
    const start = m.index!;
    if (start > cursor) out += raw.slice(cursor, start);
    out += convertWordLatinToCyrillic(m[0], baseOffset + start, changes);
    cursor = start + m[0].length;
  }
  if (cursor < raw.length) out += raw.slice(cursor);
  return { text: out, changes };
}

/**
 * Converts Uzbek Cyrillic text to the new Latin alphabet. URLs, emails, and
 * code stay protected the same way as convertToNew (see ConversionOptions).
 *
 * The iotated letters (е, ё, ю, я) are position-dependent — "ye/yo/yu/ya" at
 * the start of a word or after a vowel, plain "e/o/u/a" after a consonant —
 * which mirrors the sh/ch ambiguity in the old↔new converter. э and
 * post-consonant е both collapse to Latin "e"; see rules/cyrillic-map.ts.
 */
export function convertCyrillicToLatin(input: string, options: ConversionOptions = {}): ConversionResult {
  const resolved = resolveOptions(options);
  const segments = segment(input);
  return buildResult(segments, "cyrillic_to_latin", (kind) => shouldProtect(kind, resolved), convertTextCyrillicToLatin);
}

/**
 * Converts Latin-alphabet Uzbek text to Cyrillic. Accepts either script —
 * old ("shahar", "go'zal") or new ("şahar", "gözal") — since real user text
 * is old-script at least as often as not; both sh/ch and o'/g' are
 * recognized as digraphs alongside the already-unambiguous ş/ç/ö/ğ/q/h.
 * "y" + vowel and "ts" sequences use the same kind of positional heuristic
 * as the Cyrillic -> Latin direction and carry the same known-limitation
 * caveats (see rules/cyrillic-map.ts).
 */
export function convertLatinToCyrillic(input: string, options: ConversionOptions = {}): ConversionResult {
  const resolved = resolveOptions(options);
  const segments = segment(input);
  return buildResult(segments, "latin_to_cyrillic", (kind) => shouldProtect(kind, resolved), convertTextLatinToCyrillic);
}
