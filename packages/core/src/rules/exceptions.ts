/**
 * Words where "sh" or "ch" is NOT a digraph but two independent consonants
 * across a morpheme/compound boundary. Matched case-insensitively against
 * the whole word. Keep this list small and
 * evidence-backed — every entry should cite a source in its PR description per
 * CONTRIBUTING.md. When in doubt, do NOT add a word here: the default digraph
 * rule is correct for the overwhelming majority of Uzbek text.
 */
export const DIGRAPH_BOUNDARY_EXCEPTIONS: ReadonlySet<string> = new Set([
  "ishoq", // Is-hoq — ism (given name, cf. Isaac). To'g'ri imlosi tutuq belgisi bilan
           // "Is'hoq", lekin foydalanuvchilar ko'pincha apostrofsiz "Ishoq" deb yozadi —
           // shu ikkala holatni ham "sh"ni digraf sifatida buzmasdan ushlab qolish kerak.
]);

export function isDigraphException(lowerWord: string): boolean {
  return DIGRAPH_BOUNDARY_EXCEPTIONS.has(lowerWord);
}
