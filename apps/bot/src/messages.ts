// Every user-facing string here has been run through our own convertToNew()
// to confirm the new-alphabet spelling — the same dogfooding discipline
// applied to apps/web.

export const BUTTON_TO_NEW = "Yangiga ötkaziş";
export const BUTTON_TO_OLD = "Eskiga ötkaziş";
export const BUTTON_STATS = "📊 Statistika";
export const BUTTON_HELP = "❓ Yordam";
export const BUTTON_FEEDBACK = "💬 Fikr bildiriş";

export const WELCOME = [
  "Assalomu alaykum! Men Imlogram botiman — eski va yangi özbek lotin alifbosi orasida matningizni işonçli ögiraman.",
  "",
  `Istalgan vaqtda menga matn yuboring: avtomatik aniqlab, "${BUTTON_TO_NEW}" yoki "${BUTTON_TO_OLD}" tugmalari bilan natijani körsataman. Pastdagi tugmalar orqali yordam va statistikangizni ham körişingiz mumkin.`,
  "",
  "Batafsil: imlogram.uz",
].join("\n");

export const HELP = [
  "Shunçaki matn yuboring — men yozuv turini avtomatik aniqlab, tugmalar orqali kerakli tomonga ögiraman. Heç qanday buyruq eslab qoliş şart emas.",
  "",
  `${BUTTON_STATS} — jami konvertatsiyalaringiz`,
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

export function statsMessage(used: number): string {
  return `Jami konvertatsiyalaringiz: ${used}`;
}

export function detectedMessage(label: string, confidencePercent: number): string {
  return `Aniqlandi: ${label} (işonç: ${confidencePercent}%)`;
}

export const NOT_SUBSCRIBED_MESSAGE = "Botdan foydalaniş uçun avval kanalimizga a'zo böling:";
export const BUTTON_JOIN_CHANNEL = "Kanalga a'zo böliş";
export const BUTTON_CHECK_SUBSCRIPTION = "Tekşirdim, a'zo böldim";
export const STILL_NOT_SUBSCRIBED = "Hali kanalga a'zo bölmadingiz. Iltimos avval qöşiling.";
