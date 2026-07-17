import { segment } from "./segmenter.js";
import type { Segment } from "./types.js";

// Source-code mode inverts the default segmenter's assumption. The generic
// segmenter treats everything as convertible "text" unless a protector
// recognizes a zone to shield (URL, code fence, HTML tag, ...). That default
// is wrong for a whole source file: an unrecognized span is code (an
// identifier, a keyword, a Tailwind class) far more often than it is prose.
// So here the default is "protect it", and only two kinds of span are ever
// carved out as convertible: string-literal content that reads like natural
// language, and JSX text nodes.

const TAG_RE = /^<\/?[a-zA-Z][a-zA-Z0-9:_-]*(?:\s+[^<>]*?)?\/?>/;
const ATTR_RE = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*(["'])((?:(?!\2)[^\\]|\\.)*)\2/g;

// Attributes/props whose value is meant to be read by a human. Everything
// else in a tag (className, href, id, key, type, ...) stays protected.
const TRANSLATABLE_ATTRS = new Set(["placeholder", "title", "alt", "aria-label", "aria-description", "aria-valuetext"]);

/**
 * True when a string's *shape* is a code token (a Tailwind/CSS class list,
 * an identifier list) rather than prose: every whitespace-separated piece is
 * lowercase-alnum optionally chained with -, :, ., or /. Natural Uzbek UI
 * copy almost always has a capitalized word or sentence punctuation, so it
 * fails this test and is treated as convertible — the failure mode when a
 * genuine all-lowercase one-word string slips through this heuristic is
 * "left unconverted", which matches this project's documented
 * conservative-by-default stance (docs/spec/08 §8.4).
 *
 * NOT sufficient on its own for import/require specifiers — a path like
 * "@/components/ConverterPanel" has capital letters and would look like
 * prose by shape alone. Those are caught separately by
 * `isImportSpecifierContext`, a syntactic check, not a shape guess.
 */
function looksLikeCodeToken(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  return trimmed.split(/\s+/).every((token) => /^[a-z0-9]+([-:/.][a-z0-9%[\]]+)*$/.test(token));
}

const IMPORT_SPECIFIER_CONTEXT_RE = /(?:\bfrom\s*|\brequire\s*\(\s*|\bimport\s*\(\s*)$/;

/** True when the quote about to open at `quoteStart` is an import/require/dynamic-import specifier. */
function isImportSpecifierContext(source: string, quoteStart: number): boolean {
  return IMPORT_SPECIFIER_CONTEXT_RE.test(source.slice(Math.max(0, quoteStart - 40), quoteStart));
}

function pushSubSegments(out: Segment[], raw: string, offset: number): void {
  if (raw.length === 0) return;
  for (const sub of segment(raw)) {
    out.push({ kind: sub.kind, raw: sub.raw, start: offset + sub.start, end: offset + sub.end });
  }
}

function pushStringLiteralContent(out: Segment[], inner: string, offset: number): void {
  if (inner.length === 0) return;
  if (looksLikeCodeToken(inner)) {
    out.push({ kind: "code-block", raw: inner, start: offset, end: offset + inner.length });
  } else {
    // Still worth protecting a URL/email that happens to live inside otherwise
    // natural-language copy, so delegate rather than converting blindly.
    pushSubSegments(out, inner, offset);
  }
}

function pushTagSegments(out: Segment[], tagText: string, tagStart: number): void {
  const carveOuts: { start: number; end: number; value: string }[] = [];
  for (const m of tagText.matchAll(ATTR_RE)) {
    const attrName = m[1].toLowerCase();
    const value = m[3];
    if (!TRANSLATABLE_ATTRS.has(attrName) || looksLikeCodeToken(value)) continue;
    const relStart = m.index! + m[0].indexOf(value);
    carveOuts.push({ start: relStart, end: relStart + value.length, value });
  }
  carveOuts.sort((a, b) => a.start - b.start);

  let cursor = 0;
  for (const c of carveOuts) {
    if (c.start > cursor) {
      out.push({ kind: "code-block", raw: tagText.slice(cursor, c.start), start: tagStart + cursor, end: tagStart + c.start });
    }
    pushSubSegments(out, c.value, tagStart + c.start);
    cursor = c.end;
  }
  if (cursor < tagText.length) {
    out.push({ kind: "code-block", raw: tagText.slice(cursor), start: tagStart + cursor, end: tagStart + tagText.length });
  }
}

/**
 * Given `source[start] === "{"`, returns the index right after the matching
 * closing brace, treating nested strings/template literals/comments as
 * opaque so a literal `{`/`}` inside them doesn't miscount the depth.
 */
function skipBalancedBraces(source: string, start: number): number {
  let i = start + 1;
  let depth = 1;
  while (i < source.length && depth > 0) {
    const c = source[i];
    if (c === "{") {
      depth++;
      i++;
    } else if (c === "}") {
      depth--;
      i++;
    } else if (c === '"' || c === "'") {
      const quote = c;
      i++;
      while (i < source.length && source[i] !== quote) {
        i += source[i] === "\\" ? 2 : 1;
      }
      i++;
    } else if (c === "`") {
      i++;
      let templateDepth = 0;
      while (i < source.length) {
        if (source[i] === "\\") {
          i += 2;
          continue;
        }
        if (source[i] === "`" && templateDepth === 0) {
          i++;
          break;
        }
        if (source[i] === "$" && source[i + 1] === "{") {
          templateDepth++;
          i += 2;
          continue;
        }
        if (source[i] === "}" && templateDepth > 0) {
          templateDepth--;
          i++;
          continue;
        }
        i++;
      }
    } else if (c === "/" && source[i + 1] === "/") {
      const end = source.indexOf("\n", i);
      i = end === -1 ? source.length : end;
    } else if (c === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 2;
    } else {
      i++;
    }
  }
  return i;
}

/**
 * Scans JSX children starting right after an opening tag's `>`, alternating
 * between literal text runs (convertible) and `{expr}` runs (protected),
 * until the next `<` (a child/sibling/closing tag) or end of input.
 */
function scanJsxChildren(source: string, start: number, out: Segment[]): number {
  let i = start;
  let textStart = i;

  function flushText(end: number): void {
    if (end > textStart) {
      pushSubSegments(out, source.slice(textStart, end), textStart);
    }
  }

  while (i < source.length && source[i] !== "<") {
    if (source[i] === "{") {
      flushText(i);
      const exprStart = i;
      i = skipBalancedBraces(source, i);
      out.push({ kind: "code-block", raw: source.slice(exprStart, i), start: exprStart, end: i });
      textStart = i;
      continue;
    }
    i++;
  }
  flushText(i);
  return i;
}

export function segmentSourceCode(source: string): Segment[] {
  const segments: Segment[] = [];
  let i = 0;
  let codeStart = 0;

  function flushCode(end: number): void {
    if (end > codeStart) {
      segments.push({ kind: "code-block", raw: source.slice(codeStart, end), start: codeStart, end });
    }
  }

  while (i < source.length) {
    const ch = source[i];

    if (ch === "/" && source[i + 1] === "/") {
      const end = source.indexOf("\n", i);
      i = end === -1 ? source.length : end;
      continue;
    }

    if (ch === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 2;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      const start = i;
      i++;
      while (i < source.length && source[i] !== quote) {
        i += source[i] === "\\" ? 2 : 1;
      }
      const hasClosingQuote = i < source.length;
      const contentEnd = i;
      if (hasClosingQuote) i++;

      flushCode(start);
      segments.push({ kind: "code-block", raw: quote, start, end: start + 1 });
      if (isImportSpecifierContext(source, start)) {
        segments.push({ kind: "code-block", raw: source.slice(start + 1, contentEnd), start: start + 1, end: contentEnd });
      } else {
        pushStringLiteralContent(segments, source.slice(start + 1, contentEnd), start + 1);
      }
      if (hasClosingQuote) {
        segments.push({ kind: "code-block", raw: quote, start: contentEnd, end: contentEnd + 1 });
      }
      codeStart = i;
      continue;
    }

    if (ch === "`") {
      const start = i;
      flushCode(start);
      segments.push({ kind: "code-block", raw: "`", start, end: start + 1 });
      i++;
      let partStart = i;

      while (i < source.length && source[i] !== "`") {
        if (source[i] === "\\") {
          i += 2;
          continue;
        }
        if (source[i] === "$" && source[i + 1] === "{") {
          pushStringLiteralContent(segments, source.slice(partStart, i), partStart);
          const exprStart = i;
          i += 2;
          let depth = 1;
          while (i < source.length && depth > 0) {
            if (source[i] === "{") depth++;
            else if (source[i] === "}") depth--;
            i++;
          }
          segments.push({ kind: "code-block", raw: source.slice(exprStart, i), start: exprStart, end: i });
          partStart = i;
          continue;
        }
        i++;
      }

      if (i > partStart) {
        pushStringLiteralContent(segments, source.slice(partStart, i), partStart);
      }
      const hasClosingBacktick = i < source.length;
      if (hasClosingBacktick) {
        segments.push({ kind: "code-block", raw: "`", start: i, end: i + 1 });
        i++;
      }
      codeStart = i;
      continue;
    }

    if (ch === "<" && /[a-zA-Z/]/.test(source[i + 1] ?? "")) {
      const m = TAG_RE.exec(source.slice(i));
      if (m) {
        const start = i;
        const end = i + m[0].length;
        flushCode(start);
        pushTagSegments(segments, m[0], start);
        i = end;
        codeStart = i;

        if (!m[0].endsWith("/>") && !m[0].startsWith("</")) {
          i = scanJsxChildren(source, i, segments);
          codeStart = i;
        }
        continue;
      }
    }

    i++;
  }

  flushCode(source.length);
  segments.sort((a, b) => a.start - b.start);
  return segments;
}
