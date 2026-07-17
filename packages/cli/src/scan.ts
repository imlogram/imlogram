import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { segmentSourceCode, convertToNew, convertToOld, type ConversionDirection } from "@imlogram/core";

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const IGNORE_DIRS = new Set(["node_modules", ".git", ".next", ".turbo", "dist", "build", "coverage", ".vercel"]);

export interface Candidate {
  id: string;
  file: string;
  start: number;
  end: number;
  line: number;
  column: number;
  original: string;
  converted: string;
  approved: boolean;
}

/** 1-indexed line/column for a character offset, the way editors count them. */
function lineAndColumn(source: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < offset; i++) {
    if (source[i] === "\n") {
      line++;
      lastNewline = i;
    }
  }
  return { line, column: offset - lastNewline };
}

function walk(dir: string, out: string[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry) || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(extname(entry))) out.push(full);
  }
}

/** Scans every source file under `rootDir` and returns one Candidate per
 * convertible string — a file where nothing would change contributes none. */
export function scanProject(rootDir: string, direction: ConversionDirection): Candidate[] {
  const files: string[] = [];
  walk(rootDir, files);
  const convert = direction === "old_to_new" ? convertToNew : convertToOld;

  const candidates: Candidate[] = [];
  let id = 0;
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const seg of segmentSourceCode(source)) {
      if (seg.kind !== "text" || seg.raw.trim().length === 0) continue;
      const converted = convert(seg.raw).text;
      if (converted === seg.raw) continue;
      const { line, column } = lineAndColumn(source, seg.start);
      candidates.push({
        id: String(id++),
        file,
        start: seg.start,
        end: seg.end,
        line,
        column,
        original: seg.raw,
        converted,
        approved: true,
      });
    }
  }
  return candidates;
}
