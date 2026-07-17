interface FaqItem {
  q: string;
  a: string;
}

export function FaqStructuredData({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify of a static, hand-authored array — no user input,
      // safe to inject without additional escaping.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
