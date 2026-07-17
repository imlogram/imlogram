import type { Metadata } from "next";
import { DIGRAPH_BOUNDARY_EXCEPTIONS } from "@imlogram/core";
import { CodeBlock } from "@/components/CodeBlock";
import { Reveal } from "@/components/Reveal";

const EXCEPTIONS = Array.from(DIGRAPH_BOUNDARY_EXCEPTIONS).sort();

const TITLE = "Hujjatlar";
const DESCRIPTION =
  "@imlogram/core, @imlogram/parser va @imlogram/cli kutubxonalarini loyihangizda qanday işlatiş — örnatiş, API va misollar bilan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "imlogram kutubxona",
    "@imlogram/core",
    "@imlogram/parser",
    "@imlogram/cli",
    "o'zbek alifbosi npm paket",
    "kod fayllarini konvertatsiya qilish",
  ],
  alternates: { canonical: "/hujjatlar" },
  openGraph: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION, url: "/hujjatlar" },
  twitter: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION },
};

const TOC = [
  { href: "#ornatish", label: "Örnatiş" },
  { href: "#core", label: "@imlogram/core" },
  { href: "#parser", label: "@imlogram/parser" },
  { href: "#cli", label: "@imlogram/cli" },
  { href: "#nega-murakkab", label: "Nega ikki yönaliş har xil" },
  { href: "#misollar", label: "Misollar" },
  { href: "#havolalar", label: "Havolalar" },
];

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
      {children}
    </h2>
  );
}

export default function HujjatlarPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hujjatlar</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Uç oçiq kodli npm paketi: <code>@imlogram/core</code>, <code>@imlogram/parser</code> va{" "}
          <code>@imlogram/cli</code>. Barçasi şu yerda örnatiş, API va misollar bilan
          tuşuntirilgan.
        </p>
      </div>

      <div className="grid gap-10 pt-6 lg:grid-cols-[200px_1fr]">
        <nav className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-s border-slate-200 text-sm dark:border-slate-800">
            {TOC.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="-ms-px block border-s border-transparent py-1 pl-3 text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:text-slate-400 dark:hover:border-brand-500 dark:hover:text-brand-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-14">
          <Reveal delay={0.0}>
            <section id="ornatish" className="space-y-3">
              <SectionHeading id="ornatish">Örnatiş</SectionHeading>
              <p className="text-sm text-slate-600 dark:text-slate-400">Kerakli paketni tanlab örnating:</p>
              <CodeBlock
                code={`pnpm add @imlogram/core       # konvertatsiya, aniqlaş, statistika
pnpm add @imlogram/parser     # segmentatsiya (core şu ustiga qurilgan)
npx @imlogram/cli migrate .   # loyihadagi kod fayllarini ötkaziş`}
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Node.js, brauzer va Edge runtime&apos;larning (Cloudflare Workers, Vercel Edge)
                barçasida bir xil işlaydi — heç qanday runtime-specific boğliqlik yöq.
              </p>
            </section>
          </Reveal>

          <Reveal delay={0.05}>
            <section id="core" className="space-y-4">
              <SectionHeading id="core">@imlogram/core</SectionHeading>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Eski va yangi lotin alifbosi hamda kirilça orasida konvertatsiya, aniqlaş va
                statistika mantiği. Kod bloklari, URL, email va HTML struktura içidagi matnga heç
                qaçon tegmaydi — bu himoyani <code>@imlogram/parser</code> ta&apos;minlaydi.
              </p>

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Tezkor boşlaş</h3>
              <CodeBlock
                code={`import { convertToNew, convertToOld, detect, getStatistics } from "@imlogram/core";

convertToNew("Bu shahar juda chiroyli va go'zal.").text;
// "Bu şahar juda çiroyli va gözal."

convertToOld("Bu şahar juda çiroyli va gözal.").text;
// "Bu shahar juda chiroyli va go'zal."

detect("Bu shahar juda gözal.");
// { classification: "mixed", confidence: 0.5, segments: [...] }`}
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">Kod bloklari va URL heç qaçon özgarmaydi:</p>
              <CodeBlock
                code={`convertToNew("Ko'ring: https://example.com/Shop va \`ShoppingCart\` klassi.").text;
// "Köring: https://example.com/Shop va \`ShoppingCart\` klassi."
//          ^ o'zgarmadi                  ^ o'zgarmadi`}
              />

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                <code>convertToNew(text, options?)</code> / <code>convertToOld(text, options?)</code>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Eski ↔ yangi lotin alifbosi orasida konvertatsiya.</p>
              <CodeBlock
                code={`interface ConversionOptions {
  protectUrls?: boolean;   // standart: true
  protectCode?: boolean;   // standart: true
  protectHtml?: boolean;   // standart: true
}

interface ConversionResult {
  text: string;
  direction: "old_to_new" | "new_to_old" | "cyrillic_to_latin" | "latin_to_cyrillic";
  changes: Change[];   // har bir o'zgarish: { start, end, from, to, reason }
  stats: { charCount, wordCount, changedCount, readingTimeSec };
}`}
              />
              <div className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900/90 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200/90">
                <p>
                  <strong>Muhim</strong>: yangi→eski yönaliş 100% deterministik (bitta harflik
                  jadval). Eski→yangi yönaliş esa <code>sh</code>/<code>ch</code> digraf yoki
                  ikkita mustaqil undoş ekanini aniqlaşi kerak — buning uçun kiçik,
                  kengaytiriladigan istisnolar luğati işlatiladi. Standart holatda har doim
                  digraf deb hisoblanadi; luğatga kiritilgan sözlardagina ikkita mustaqil
                  undoş sifatida ajratiladi.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-amber-300/60 text-left dark:border-amber-800/60">
                        <th className="py-1.5 pr-4 font-medium">Söz (luğat kaliti)</th>
                        <th className="py-1.5 font-medium">Töğri yozilişi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-300/40 dark:divide-amber-800/40">
                      {EXCEPTIONS.map((word) => (
                        <tr key={word}>
                          <td className="py-1.5 pr-4 font-mono text-xs">{word}</td>
                          <td className="py-1.5">
                            {word === "ishoq" ? (
                              <>
                                Is&apos;hoq <span className="text-amber-700/70 dark:text-amber-300/70">(tutuq belgisi bilan; apostrofsiz &quot;Ishoq&quot; ham şu qatorga tuşadi)</span>
                              </>
                            ) : (
                              word
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>
                  Bu röyxat qasddan tor tutiladi — har bir yangi söz manba (masalan lug&apos;at
                  yoki adabiyot misoli) bilan asoslanişi kerak, aks holda notöğri istisno
                  haqiqiy sözlarni buzişi mumkin.{" "}
                  <a
                    href="https://github.com/imlogram/imlogram/blob/main/packages/core/src/rules/exceptions.ts"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-100"
                  >
                    Manba kod
                  </a>{" "}
                  şu yerda — yana söz bilasizmi?{" "}
                  <a
                    href="https://github.com/imlogram/imlogram/issues"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-100"
                  >
                    GitHub&apos;da issue oçing yoki PR yuboring
                  </a>
                  .
                </p>
              </div>

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                <code>convertCyrillicToLatin(text, options?)</code> /{" "}
                <code>convertLatinToCyrillic(text, options?)</code>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Özbek kirilçasi ↔ yangi lotin alifbosi. Lotin tomoni ham eski, ham yangi skriptni
                qabul qiladi (<code>shahar</code> va <code>şahar</code> ikkalasi ham töğri işlaydi).
              </p>
              <CodeBlock
                code={`convertCyrillicToLatin("Бу шаҳар гўзал.").text;   // "Bu şahar gözal."
convertLatinToCyrillic("Bu shahar go'zal.").text;   // "Бу шаҳар гўзал."`}
              />

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                <code>detect(text): DetectionResult</code>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Matn eski, yangi yoki aralaş yozuvda ekanini aniqlaydi, gap darajasida:</p>
              <CodeBlock
                code={`interface DetectionResult {
  classification: "old" | "new" | "mixed";
  confidence: number;
  segments: { start: number; end: number; classification: "old" | "new" }[];
}`}
              />

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                <code>getStatistics(text): LetterStatistics</code>
              </h3>
              <CodeBlock
                code={`getStatistics("Shahar chiroyli, bog'da o'ynayapmiz.");
// { letterCounts: { sh: 1, ch: 1, "gʻ": 1, "oʻ": 1 }, totalSpecialChars: 4 }`}
              />

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                <code>convertCodeToNew(sourceCode)</code> / <code>convertCodeToOld(sourceCode)</code>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <code>.ts</code>/<code>.tsx</code> fayllar içidagi UI matnini konvertatsiya qiladi —
                özgaruvçi nomlari, import yöllari, JSX teglari va Tailwind klasslariga tegmasdan:
              </p>
              <CodeBlock
                code={`convertCodeToNew(\`
  const [showChanges, setShowChanges] = useState(true);
  return <label placeholder="Matnni shu yerga yozing...">Kirish matni</label>;
\`).text;
// showChanges — o'zgarmadi (identifikator)
// "Matnni shu yerga yozing..." → "Matnni şu yerga yozing..." (placeholder — matn)
// "Kirish matni" → "Kiriş matni" (JSX matn tuguni)`}
              />
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section id="parser" className="space-y-4">
              <SectionHeading id="parser">@imlogram/parser</SectionHeading>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Matnni himoyalangan zonalar (URL, email, kod bloklari, HTML teglari, front-matter)
                va oddiy matnga ajratadigan segmentatsiya dvigateli. <code>@imlogram/core</code> şu
                paket ustiga qurilgan — u qaysi qismlarni özgartiriş mumkinligini, qaysilarini
                özgartirib bölmasligini şu yerdan biladi.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Odatda bu paketni töğridan-töğri emas, <code>@imlogram/core</code> orqali
                işlatasiz. Faqat özingizning maxsus matn-qayta-işlaş vositangizni qurmoqçi
                bölsangiz, buni alohida işlatişingiz mumkin.
              </p>
              <CodeBlock
                code={`import { segment } from "@imlogram/parser";

const segments = segment("Sayt: https://example.com/Shop haqida gapiraylik.");

for (const seg of segments) {
  console.log(seg.kind, JSON.stringify(seg.raw));
}
// text  "Sayt: "
// url   "https://example.com/Shop"
// text  " haqida gapiraylik."`}
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manba kod fayllari (<code>.ts</code>/<code>.tsx</code>) uçun alohida rejim bor —
                bunda standart teskari: hamma narsa <strong>kod</strong> deb hisoblanadi, faqat
                tabiiy-tilga öxşagan string literal va JSX matn tugunlari &quot;matn&quot; deb
                belgilanadi:
              </p>
              <CodeBlock
                code={`import { segmentSourceCode } from "@imlogram/parser";

const segments = segmentSourceCode(\`
  const label = "Kirish matni"; // matn — konvertatsiya qilinadi
  const className = "rounded-full px-4"; // kod-shaklidagi satr — himoyalangan
\`);`}
              />

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Nima himoyalanadi</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-800">
                      <th className="py-2 pr-4 font-medium">Zona turi</th>
                      <th className="py-2 font-medium">Misol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {[
                      ["URL", "https://example.com/Shop"],
                      ["Email", "shukur@example.uz"],
                      ["Kod bloki (fenced)", "```js\\nconst x = 1;\\n```"],
                      ["Inline kod", "`ShoppingCart`"],
                      ["HTML teg + atributlar", '<div className="rounded-full">'],
                      ["Front-matter", "Fayl boşidagi ---\\n...\\n--- bloki"],
                    ].map(([kind, example]) => (
                      <tr key={kind}>
                        <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{kind}</td>
                        <td className="py-2 font-mono text-xs text-slate-500 dark:text-slate-400">{example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.15}>
            <section id="cli" className="space-y-4">
              <SectionHeading id="cli">@imlogram/cli</SectionHeading>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Skanerlaydi. Körsatadi. Siz tasdiqlaysiz. Şundan keyingina fayllarga yozadi.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Loyihangizdagi <code>.ts</code>/<code>.tsx</code>/<code>.js</code>/<code>.jsx</code>{" "}
                fayllarni topib, ularning içidagi tabiiy-tilga öxşagan matnlarni (
                <code>@imlogram/core</code> orqali) aniqlaydi — özgaruvçi nomlari, importlar, JSX
                teglari va Tailwind klasslariga tegmasdan. Keyin brauzerda lokal bir sahifa oçadi:
                har bir topilgan matnni körasiz, kerakmaganlarini bekor qilasiz, va faqat
                tasdiqlangan özgarişlar diskdagi fayllarga yoziladi.
              </p>
              <CodeBlock
                code={`npx @imlogram/cli migrate .

# Skanerlanmoqda: /path/to/loyiha
# 14 ta matn topildi (5 ta faylda).
#
# Körib çiqiş uçun brauzerda oçing: http://localhost:4321`}
              />

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Parametrlar</h3>
              <CodeBlock code={`npx @imlogram/cli migrate [papka] [--to=new|old] [--port=4321]`} />
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-800">
                      <th className="py-2 pr-4 font-medium">Parametr</th>
                      <th className="py-2 pr-4 font-medium">Standart</th>
                      <th className="py-2 font-medium">Tavsif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {[
                      ["papka", ".", "Qaysi papkani skanerlaş kerak"],
                      ["--to", "new", "new — eski→yangi, old — yangi→eski"],
                      ["--port", "4321", "Lokal serverning porti"],
                    ].map(([param, def, desc]) => (
                      <tr key={param}>
                        <td className="py-2 pr-4 font-mono text-xs text-slate-700 dark:text-slate-300">{param}</td>
                        <td className="py-2 pr-4 font-mono text-xs text-slate-500 dark:text-slate-400">{def}</td>
                        <td className="py-2 text-slate-600 dark:text-slate-400">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Nega bu CLI kerak, sayt yetarli emasmi</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                imlogram.uz dagi Aylantirgiç bitta matn parçasini qabul qiladi. Bu CLI esa{" "}
                <strong>butun loyihani</strong> — önlab fayllarni bir yöla — skanerlab, har bir
                özgarişni köz bilan körib tasdiqlaş imkonini beradi, va natijani töğridan-töğri
                fayllaringizga yozadi. Katta kod bazasini yangi alifboga ötkaziş uçun möljallangan.
              </p>

              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Xavfsizlik</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                CLI heç qanday tarmoqqa (internet) sörov yubormaydi — hammasi lokal maşinangizda,
                lokal serverda işlaydi. Fayllarga yozişdan oldin har doim{" "}
                <code>git status</code>/<code>git diff</code> bilan tekşirib çiqiş, yoki avval
                commit qilib oliş tavsiya etiladi (özgarişlarni qaytarib bölmaydigan holatga
                tuşmaslik uçun).
              </p>
            </section>
          </Reveal>

          <Reveal delay={0.2}>
            <section id="nega-murakkab" className="space-y-3">
              <SectionHeading id="nega-murakkab">Nega ikki yönaliş har xil murakkablikda</SectionHeading>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Yangi → eski — sof jadval, heç qanday noaniqlik yöq: har bir yangi harf eski
                yozuvda faqat bitta körinişga ega. Eski → yangi esa unday emas:{" "}
                <code>sh</code> harflar birikmasi köpinça <code>ş</code> digrafi, lekin ba&apos;zan
                (masalan <strong>Is&apos;hoq</strong> ismida — tutuq belgisi <em>s</em> va{" "}
                <em>h</em> orasida) ikkita mustaqil undoş sifatida alohida talaffuz qilinadi.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Bu noaniqlikni hal qiliş uçun kiçik, qölda tuzilgan istisnolar luğati işlatiladi:
                standart holatda har doim digraf deb hisoblanadi, faqat luğatda röyxatga olingan
                sözlarda ikkita mustaqil undoş sifatida ajratiladi. Şu sababli yangi → eski
                yönaliş 100% deterministik, eski → yangi esa emas — bu loyihaning markaziy texnik
                muammosi.
              </p>
            </section>
          </Reveal>

          <Reveal delay={0.25}>
            <section id="misollar" className="space-y-4">
              <SectionHeading id="misollar">Misollar</SectionHeading>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kutubxonani haqiqiy loyihada qanday işlatişni köriş uçun ikkita mustaqil namuna
                loyiha bor — ikkalasi ham npm registridan çiqargan haqiqiy paketni işlatadi,
                workspace içidagi manba kodni emas:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="https://github.com/imlogram/imlogram/tree/main/examples/html"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    examples/html
                  </a>{" "}
                  — oddiy HTML+JS sahifa, heç qanday build vositasisiz
                </li>
                <li>
                  <a
                    href="https://github.com/imlogram/imlogram/tree/main/examples/react"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    examples/react
                  </a>{" "}
                  — React + Vite loyihasi
                </li>
              </ul>
            </section>
          </Reveal>

          <Reveal delay={0.3}>
            <section id="havolalar" className="space-y-2 pb-4">
              <SectionHeading id="havolalar">Havolalar</SectionHeading>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  Manba kod:{" "}
                  <a
                    href="https://github.com/imlogram/imlogram"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    github.com/imlogram/imlogram
                  </a>
                </li>
                <li>
                  npm:{" "}
                  <a
                    href="https://www.npmjs.com/package/@imlogram/core"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    @imlogram/core
                  </a>
                  {" · "}
                  <a
                    href="https://www.npmjs.com/package/@imlogram/parser"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    @imlogram/parser
                  </a>
                  {" · "}
                  <a
                    href="https://www.npmjs.com/package/@imlogram/cli"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    @imlogram/cli
                  </a>
                </li>
                <li>
                  Muammo haqida xabar beriş:{" "}
                  <a
                    href="https://github.com/imlogram/imlogram/issues"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                  >
                    GitHub Issues
                  </a>
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
