/**
 * All Unicode code points a human, keyboard, or copy-paste chain can plausibly
 * produce in place of the "turned comma" used in oʻ / gʻ. Any of these immediately
 * following o/O/g/G is treated as the same special letter.
 */
export const APOSTROPHE_VARIANTS: readonly string[] = [
  "ʻ", // ʻ MODIFIER LETTER TURNED COMMA (rasmiy/official)
  "ʼ", // ʼ MODIFIER LETTER APOSTROPHE
  "'", // ' APOSTROPHE
  "‘", // ' LEFT SINGLE QUOTATION MARK
  "’", // ' RIGHT SINGLE QUOTATION MARK
  "`", // ` GRAVE ACCENT
  "ˋ", // ˋ MODIFIER LETTER GRAVE ACCENT
  "´", // ´ ACUTE ACCENT
];

export const APOSTROPHE_VARIANT_SET: ReadonlySet<string> = new Set(APOSTROPHE_VARIANTS);

/** Canonical apostrophe used when rendering the old script (e.g. Ö → Oʻ). */
export const CANONICAL_APOSTROPHE = "ʻ";
