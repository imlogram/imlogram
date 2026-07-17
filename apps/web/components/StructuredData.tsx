const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "imlogram.uz",
  url: "https://imlogram.uz",
  description:
    "Eski va yangi özbek lotin alifbosi orasida matnlarni işonçli konvertatsiya qiling, aniqlang va tekşiring. Kod, URL va struktura buzilmasdan.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  inLanguage: "uz",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Person",
    name: "Saidqodirxon Rahim Abdullo o'g'li",
    sameAs: ["https://t.me/SaidqodirxonUz"],
  },
  sameAs: ["https://t.me/imlogramuz", "https://t.me/imlogrambot"],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify of a static, hand-authored object — no user input,
      // safe to inject without additional escaping.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
