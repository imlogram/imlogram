export { convertToNew, convertToOld, convertCodeToNew, convertCodeToOld } from "./convert.js";
export { convertCyrillicToLatin, convertLatinToCyrillic } from "./convert-cyrillic.js";
export { detect } from "./detect.js";
export { getStatistics } from "./statistics.js";
// Re-exported so consumers can build their own review/approval UI on top of
// convertCodeToNew/convertCodeToOld's segmentation — see apps/web's /kod page.
export { segmentSourceCode } from "@imlogram/parser";
export type { Segment, SegmentKind } from "@imlogram/parser";
export type {
  Change,
  ConversionDirection,
  ConversionOptions,
  ConversionResult,
  ConversionStats,
  DetectionResult,
  DetectionSegment,
  LetterStatistics,
  ScriptClassification,
} from "./types.js";
