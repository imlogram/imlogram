import { readFileSync, writeFileSync } from "node:fs";
import type { Candidate } from "./scan.js";

export interface ApplySummary {
  file: string;
  count: number;
}

/** Writes every approved candidate back to its source file, one write per file. */
export function applyCandidates(candidates: Candidate[]): ApplySummary[] {
  const byFile = new Map<string, Candidate[]>();
  for (const c of candidates) {
    if (!c.approved) continue;
    const list = byFile.get(c.file) ?? [];
    list.push(c);
    byFile.set(c.file, list);
  }

  const summaries: ApplySummary[] = [];
  for (const [file, list] of byFile) {
    const source = readFileSync(file, "utf8");
    const sorted = [...list].sort((a, b) => a.start - b.start);

    let out = "";
    let cursor = 0;
    for (const c of sorted) {
      out += source.slice(cursor, c.start) + c.converted;
      cursor = c.end;
    }
    out += source.slice(cursor);

    writeFileSync(file, out, "utf8");
    summaries.push({ file, count: list.length });
  }
  return summaries;
}
