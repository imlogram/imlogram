// Every user-facing string here has been run through our own convertToNew()
// to confirm the new-alphabet spelling — the same dogfooding discipline
// applied to apps/web (see docs/spec/08-parser-design.md).

export const BUTTON_TO_NEW = "Yangi alifboga ötkaziş";
export const BUTTON_TO_OLD = "Eski alifboga ötkaziş";
export const BUTTON_STATS = "📊 Statistika";
export const BUTTON_HELP = "❓ Yordam";
export const BUTTON_FEEDBACK = "💬 Fikr bildiriş";

export const WELCOME = [
  "Assalomu alaykum! Men Imlogram botiman — eski va yangi özbek lotin alifbosi orasida matningizni konvertatsiya qilaman.",
  "",
  "Menga istalgan vaqtda matn yuboring — men avtomatik aniqlab, tugmalar orqali natijani körsataman. Pastdagi tugmalardan ham foydalanişingiz mumkin.",
].join("\n");

export const HELP = [
  "Şunçaki matn yuboring — men avtomatik aniqlab, tugmalar orqali natijani körsataman.",
  "",
  "Pastdagi tugmalar:",
  `${BUTTON_STATS} — jami konvertatsiyalar soningiz`,
  `${BUTTON_FEEDBACK} — şikoyat yoki taklif yuboriş`,
  `${BUTTON_HELP} — şu xabar`,
].join("\n");

export const CLASSIFICATION_LABEL: Record<"old" | "new" | "mixed", string> = {
  old: "Eski yozuv",
  new: "Yangi yozuv",
  mixed: "Aralaş yozuv",
};

export const FEEDBACK_PROMPT = "Fikr yoki taklifingizni yozing (keyingi xabaringiz kanalimizga yuboriladi):";
export const FEEDBACK_THANKS = "Rahmat! Fikringiz yuborildi.";
export const CONVERT_USAGE = "Foydalaniş: /convert <matn>";
export const DETECT_USAGE = "Foydalaniş: /detect <matn>";
export const TEXT_TOO_LONG = "Matn juda uzun (4096 belgidan köp). Qisqaroq matn yuboring.";

export function statsMessage(used: number): string {
  return `Bugungi jami konvertatsiyalar: ${used}`;
}

export function detectedMessage(label: string, confidencePercent: number): string {
  return `Aniqlandi: ${label} (işonç: ${confidencePercent}%)`;
}

export const NOT_SUBSCRIBED_MESSAGE = "Botdan foydalaniş uçun avval kanalimizga a'zo böling:";
export const BUTTON_JOIN_CHANNEL = "Kanalga a'zo böliş";
export const BUTTON_CHECK_SUBSCRIPTION = "Tekşirdim, a'zo böldim";
export const STILL_NOT_SUBSCRIBED = "Hali kanalga a'zo bölmadingiz. Iltimos avval qöşiling.";
