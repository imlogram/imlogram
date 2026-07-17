import { segment } from "@imlogram/parser";
import { APOSTROPHE_VARIANTS } from "./rules/apostrophe-variants.js";
import type { DetectionResult, DetectionSegment, ScriptClassification } from "./types.js";

const NEW_LETTER_RE = /[öğşçÖĞŞÇ]/g;
const OLD_APOSTROPHE_RE = new RegExp(`[oOgG][${APOSTROPHE_VARIANTS.join("")}]`, "g");
// Sentence/clause boundaries: classifying at this granularity (rather than the
// whole text blob) is what lets mixed input show *which* part is old vs new.
const CHUNK_BOUNDARY_RE = /[.!?…—]+\s*/g;

interface Chunk {
  start: number;
  end: number;
  raw: string;
}

function splitIntoChunks(text: string): Chunk[] {
  const chunks: Chunk[] = [];
  let cursor = 0;
  for (const m of text.matchAll(CHUNK_BOUNDARY_RE)) {
    const end = m.index! + m[0].length;
    chunks.push({ start: cursor, end, raw: text.slice(cursor, end) });
    cursor = end;
  }
  if (cursor < text.length) {
    chunks.push({ start: cursor, end: text.length, raw: text.slice(cursor) });
  }
  return chunks;
}

function countOldMarkers(text: string): number {
  const apostropheMatches = text.match(OLD_APOSTROPHE_RE)?.length ?? 0;
  const digraphMatches = text.match(/sh|ch/gi)?.length ?? 0;
  return apostropheMatches + digraphMatches;
}

function countNewMarkers(text: string): number {
  return text.match(NEW_LETTER_RE)?.length ?? 0;
}

function classify(oldCount: number, newCount: number): Exclude<ScriptClassification, "mixed"> | null {
  if (oldCount === 0 && newCount === 0) return null;
  if (oldCount > 0 && newCount === 0) return "old";
  if (newCount > 0 && oldCount === 0) return "new";
  return oldCount >= newCount ? "old" : "new";
}

export function detect(input: string): DetectionResult {
  const segments = segment(input).filter((s) => s.kind === "text");

  let totalOld = 0;
  let totalNew = 0;
  const detectionSegments: DetectionSegment[] = [];

  for (const seg of segments) {
    for (const chunk of splitIntoChunks(seg.raw)) {
      const oldCount = countOldMarkers(chunk.raw);
      const newCount = countNewMarkers(chunk.raw);
      totalOld += oldCount;
      totalNew += newCount;

      const local = classify(oldCount, newCount);
      if (!local) continue;

      const start = seg.start + chunk.start;
      const end = seg.start + chunk.end;
      const previous = detectionSegments.at(-1);
      // Merge into the previous run when it's classified the same and the two
      // spans are contiguous, so a highlight covers a whole phrase rather than
      // fragmenting at every sentence boundary.
      if (previous && previous.classification === local && previous.end === start) {
        previous.end = end;
      } else {
        detectionSegments.push({ start, end, classification: local });
      }
    }
  }

  let classification: ScriptClassification;
  if (totalOld === 0 && totalNew === 0) {
    classification = "new";
  } else if (totalOld > 0 && totalNew > 0) {
    classification = "mixed";
  } else {
    classification = totalOld > 0 ? "old" : "new";
  }

  const total = totalOld + totalNew;
  const confidence = total === 0 ? 0 : Math.max(totalOld, totalNew) / total;

  return { classification, confidence, segments: detectionSegments };
}
