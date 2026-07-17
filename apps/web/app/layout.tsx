import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StructuredData } from "@/components/StructuredData";
import { ThemeScript } from "@/components/ThemeScript";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { cursiveFont, sansFont } from "@/lib/fonts";

const SITE_URL = "https://imlogram.uz";
const SITE_NAME = "imlogram.uz";
const SITE_TITLE = "imlogram.uz — Özbek alifbosi konvertatsiyasi";
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
  authors: [{ name: "Saidqodirxon Rahim Abdullo öğli", url: "https://t.me/SaidqodirxonUz" }],
  creator: "Saidqodirxon Rahim Abdullo öğli",
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
  { href: "/converter", label: "Aylantirgiç" },
  { href: "/detector", label: "Aniqlagiç" },
  { href: "/alifbo", label: "Alifbo" },
  { href: "/tarix", label: "Tarix" },
  { href: "/hujjatlar", label: "Hujjatlar" },
];

interface FooterLinkItem {
  href: string;
  label: string;
}

const FOOTER_COLUMNS: { title: string; links: FooterLinkItem[] }[] = [
  {
    title: "Mahsulot",
    links: [
      { href: "/converter", label: "Aylantirgiç" },
      { href: "/detector", label: "Aniqlagiç" },
      { href: "/alifbo", label: "Alifbo" },
      { href: "/tarix", label: "Tarix" },
    ],
  },
  {
    title: "Loyiha",
    links: [
      { href: "https://github.com/imlogram/imlogram", label: "GitHub" },
      { href: "/hujjatlar", label: "Hujjatlar" },
      { href: "https://www.npmjs.com/package/@imlogram/core", label: "@imlogram/core" },
      { href: "https://www.npmjs.com/package/@imlogram/parser", label: "@imlogram/parser" },
      { href: "https://www.npmjs.com/package/@imlogram/cli", label: "@imlogram/cli" },
    ],
  },
  {
    title: "Jamiyat",
    links: [
      { href: "https://t.me/imlogramuz", label: "Telegram kanal" },
      { href: "https://t.me/imlogrambot", label: "Bot" },
      { href: "https://t.me/SaidqodirxonUz", label: "Muallif" },
    ],
  },
];

function isExternal(href: string): boolean {
  return href.startsWith("http");
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = isExternal(href);
  return (
    <a
      className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body
        className={`${cursiveFont.variable} ${sansFont.variable} flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}
      >
        <ThemeScript />
        <StructuredData />
        <SmoothScroll />
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/75">
          <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3.5">
            <a href="/" className="text-lg font-bold tracking-tight">
              imlogram
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                .uz
              </span>
            </a>
            <div className="flex items-center gap-2">
              <nav className="hidden flex-wrap items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:flex">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:px-3.5 sm:text-sm"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <ThemeToggle />
              <MobileNav items={nav} />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>

        <footer className="border-t border-slate-200/70 dark:border-slate-800/70">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <a href="/" className="text-lg font-bold tracking-tight">
                  imlogram
                  <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                    .uz
                  </span>
                </a>
                <p className="mt-2 max-w-[16rem] text-sm text-slate-500 dark:text-slate-400">
                  Özbek alifbosini işonçli konvertatsiya qiluvçi oçiq kodli platforma.
                </p>
              </div>
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {col.title}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <FooterLink href={link.href}>{link.label}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Saidqodirxon Rahim Abdullo öğli loyihasi · Oçiq kodli · MIT litsenziyasi
              </span>
              <div className="flex flex-wrap gap-4">
                <FooterLink href="/maxfiylik">Maxfiylik</FooterLink>
                <FooterLink href="https://saadahbooks.uz">Boşqa loyihamiz: saadahbooks.uz</FooterLink>
                <FooterLink href="https://saadahbooks.uz/donate">Donat qiliş</FooterLink>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
