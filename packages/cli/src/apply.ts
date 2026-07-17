import { readFileSync, writeFileSync } from "node:fs";
import type { Candidate } from "./scan.js";

export interface ApplySummary {
  file: string;
  count: number;
  stale: number;
}

/**
 * Writes every approved candidate back to its source file, one write per file.
 *
 * Candidate.start/end are byte offsets captured at scan time. If the file has
 * since changed (a prior apply in the same session, a manual edit, a stale
 * browser tab re-submitting an old scan), those offsets no longer point at
 * `original` — blindly splicing them would silently corrupt the file or
 * overwrite unrelated text. So each candidate is re-checked against the
 * current file content immediately before splicing; anything that no longer
 * matches is skipped and counted as `stale` instead of applied.
 */
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
    let applied = 0;
    let stale = 0;
    for (const c of sorted) {
      if (c.start < cursor || source.slice(c.start, c.end) !== c.original) {
        stale++;
        continue;
      }
      out += source.slice(cursor, c.start) + c.converted;
      cursor = c.end;
      applied++;
    }
    out += source.slice(cursor);

    if (applied > 0) writeFileSync(file, out, "utf8");
    if (applied > 0 || stale > 0) summaries.push({ file, count: applied, stale });
  }
  return summaries;
}
