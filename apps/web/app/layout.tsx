import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StructuredData } from "@/components/StructuredData";

const SITE_URL = "https://imlogram.uz";
const SITE_NAME = "imlogram.uz";
const SITE_TITLE = "imlogram.uz — Özbek lotin alifbosi konvertatsiyasi";
const SITE_DESCRIPTION =
  "Eski va yangi özbek lotin alifbosi orasida matnlarni işonçli konvertatsiya qiling, aniqlang va tekşiring. Kod, URL va struktura buzilmasdan.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · imlogram.uz",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "o'zbek lotin alifbosi",
    "özbek lotin",
    "eski yangi alifbo",
    "lotin konvertor",
    "imlo tekşiruvçi",
    "o'zbekcha matn konvertatsiya",
    "uzbek latin alphabet converter",
    "uzbek cyrillic to latin",
  ],
  authors: [{ name: "Saidqodirxon Rahim Abdullo o'g'li", url: "https://t.me/SaidqodirxonUz" }],
  creator: "Saidqodirxon Rahim Abdullo o'g'li",
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const nav = [
  { href: "/converter", label: "Converter" },
  { href: "/detector", label: "Detector" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="underline underline-offset-2 transition hover:text-brand-600 dark:hover:text-brand-300"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <StructuredData />
        <SmoothScroll />
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/75">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5">
            <a href="/" className="text-lg font-bold tracking-tight">
              imlogram
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                .uz
              </span>
            </a>
            <nav className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 p-1 text-sm dark:border-slate-800 dark:bg-slate-900/60">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3.5 py-1.5 font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-4xl space-y-3 px-4 py-10 text-sm text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Oçiq kodli · MIT litsenziyasi</span>
            <FooterLink href="https://github.com">GitHub</FooterLink>
            <FooterLink href="https://t.me/imlogramuz">Telegram — @imlogramuz</FooterLink>
            <FooterLink href="https://t.me/imlogrambot">Bot — @imlogrambot</FooterLink>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Boşqa loyihalarimiz:</span>
            <FooterLink href="https://saadahbooks.uz">saadahbooks.uz</FooterLink>
            <FooterLink href="https://saadahbooks.uz/donate">Donat qiliş</FooterLink>
          </div>
          <div className="text-xs text-slate-400">
            Saidqodirxon Rahim Abdullo öğli loyihasi ·{" "}
            <FooterLink href="https://t.me/SaidqodirxonUz">@SaidqodirxonUz</FooterLink>
          </div>
        </footer>
      </body>
    </html>
  );
}
