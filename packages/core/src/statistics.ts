import { segment } from "@imlogram/parser";
import { APOSTROPHE_VARIANTS } from "./rules/apostrophe-variants.js";
import type { LetterStatistics } from "./types.js";

const OLD_APOSTROPHE_RE = new RegExp(`[oOgG][${APOSTROPHE_VARIANTS.join("")}]`, "g");

function increment(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

export function getStatistics(input: string): LetterStatistics {
  const letterCounts: Record<string, number> = {};
  const textSegments = segment(input).filter((s) => s.kind === "text");

  for (const seg of textSegments) {
    for (const m of seg.raw.match(OLD_APOSTROPHE_RE) ?? []) {
      increment(letterCounts, m[0].toLowerCase() === "o" ? "oʻ" : "gʻ");
    }
    for (const m of seg.raw.match(/sh|ch/gi) ?? []) {
      increment(letterCounts, m.toLowerCase());
    }
    for (const ch of seg.raw.match(/[öğşçÖĞŞÇ]/g) ?? []) {
      increment(letterCounts, ch.toLowerCase());
    }
  }

  const totalSpecialChars = Object.values(letterCounts).reduce((a, b) => a + b, 0);
  return { letterCounts, totalSpecialChars };
}
