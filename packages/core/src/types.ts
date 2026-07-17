export type ConversionDirection = "old_to_new" | "new_to_old" | "cyrillic_to_latin" | "latin_to_cyrillic";

export interface ConversionOptions {
  /** Protect URLs and email addresses from conversion. Default: true. */
  protectUrls?: boolean;
  /** Protect fenced and inline code from conversion. Default: true. */
  protectCode?: boolean;
  /** Protect HTML/XML tags and entities from conversion. Default: true. */
  protectHtml?: boolean;
}

export interface Change {
  start: number;
  end: number;
  from: string;
  to: string;
  reason: "digraph" | "apostrophe" | "exception-skip";
}

export interface ConversionStats {
  charCount: number;
  wordCount: number;
  changedCount: number;
  readingTimeSec: number;
}

export interface ConversionResult {
  text: string;
  direction: ConversionDirection;
  changes: Change[];
  stats: ConversionStats;
}

export type ScriptClassification = "old" | "new" | "mixed";

export interface DetectionSegment {
  start: number;
  end: number;
  classification: Exclude<ScriptClassification, "mixed">;
}

export interface DetectionResult {
  classification: ScriptClassification;
  confidence: number;
  segments: DetectionSegment[];
}

export interface LetterStatistics {
  letterCounts: Record<string, number>;
  totalSpecialChars: number;
}
