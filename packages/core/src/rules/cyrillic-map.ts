/**
 * Uzbek Cyrillic ↔ new Latin alphabet mapping.
 *
 * Most letters are a deterministic 1:1 (or 1:2) correspondence. The
 * genuinely ambiguous part — same shape as the old→new sh/ch problem — is
 * the iotated vowels (е, ё, ю, я): they represent a "y + vowel" sound at the
 * start of a word or right after another vowel, and a plain vowel sound
 * right after a consonant. That positional rule is applied in
 * convert-cyrillic.ts, not here; this file only holds the letter tables.
 *
 * э and post-consonant е both collapse to Latin "e" going forward — a real
 * merge, not a bug — so the reverse direction (Latin "e" → Cyrillic) cannot
 * always recover which one was original. It defaults to э (the more common
 * standalone-e letter); а genuine е-after-consonant word will round-trip to
 * э instead of е. Documented, not silently "fixed" with a guess.
 */

export const CYRILLIC_VOWELS: ReadonlySet<string> = new Set(["а", "о", "у", "и", "е", "э", "ў", "ё", "ю", "я"]);

export const IOTATED_BASE: ReadonlyMap<string, string> = new Map([
  ["е", "e"],
  ["ё", "o"],
  ["ю", "u"],
  ["я", "a"],
]);

/** Deterministic single-letter Cyrillic → Latin correspondences (lowercase keys). */
export const CYRILLIC_TO_LATIN_SIMPLE: ReadonlyMap<string, string> = new Map([
  ["а", "a"],
  ["б", "b"],
  ["в", "v"],
  ["г", "g"],
  ["д", "d"],
  ["ж", "j"],
  ["з", "z"],
  ["и", "i"],
  ["й", "y"],
  ["к", "k"],
  ["л", "l"],
  ["м", "m"],
  ["н", "n"],
  ["о", "o"],
  ["п", "p"],
  ["р", "r"],
  ["с", "s"],
  ["т", "t"],
  ["у", "u"],
  ["ф", "f"],
  ["х", "x"],
  ["ц", "ts"],
  ["ч", "ç"],
  ["ш", "ş"],
  ["ъ", "ʼ"],
  ["ь", ""],
  ["э", "e"],
  ["ў", "ö"],
  ["қ", "q"],
  ["ғ", "ğ"],
  ["ҳ", "h"],
]);

/** Deterministic Latin (new) → Cyrillic correspondences for non-iotated letters. */
export const LATIN_TO_CYRILLIC_SIMPLE: ReadonlyMap<string, string> = new Map([
  ["a", "а"],
  ["b", "б"],
  ["v", "в"],
  ["g", "г"],
  ["d", "д"],
  ["j", "ж"],
  ["z", "з"],
  ["i", "и"],
  ["k", "к"],
  ["l", "л"],
  ["m", "м"],
  ["n", "н"],
  ["o", "о"],
  ["p", "п"],
  ["r", "р"],
  ["s", "с"],
  ["t", "т"],
  ["u", "у"],
  ["f", "ф"],
  ["x", "х"],
  ["ç", "ч"],
  ["ş", "ш"],
  ["e", "э"],
  ["ö", "ў"],
  ["q", "қ"],
  ["ğ", "ғ"],
  ["h", "ҳ"],
  ["y", "й"],
]);
