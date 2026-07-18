import { ConverterPanel } from "@/components/ConverterPanel";
import { Reveal } from "@/components/Reveal";
import { FaqStructuredData } from "@/components/FaqStructuredData";

const FAQ = [
  {
    q: "Yangi özbek alifbosida neçta harf bor?",
    a: "28 ta harf: 24 ta oddiy lotin harfi (A dan Z gaça, C va W dan taşqari) hamda tört ta maxsus harf — Ö, Ğ, Ş, Ç.",
  },
  {
    q: "Eski va yangi alifbo orasidagi farq nimada?",
    a: "Eski yozuvda ş, ç, ö, ğ ikki yoki uç belgi bilan yozilardi (sh, ch, oʻ, gʻ). Yangi yozuvda bular yagona harfga aylandi.",
  },
  {
    q: "Kirilçadan yangi alifboga qanday ötkazaman?",
    a: "Aylantirgiç sahifasida «Kirilça → Yangi» rejimini tanlang, matningizni joylaştiring — natija darhol çiqadi.",
  },
  {
    q: "«Ng» harfi yöqolib ketdimi?",
    a: "Yöq, tovuş özi qolgan, faqat alohida harf sifatida yozilmaydi — endi n+g birikmasi sifatida yoziladi.",
  },
  {
    q: "Matnim serverga yuboriladimi?",
    a: "Yöq, konvertatsiya töliq brauzeringizda işlaydi, heç qanday matn serverga jönatilmaydi.",
  },
  {
    q: "Kod fayllarimni (masalan .tsx yoki .js) qanday konvertatsiya qilaman?",
    a: "npx @imlogram/cli migrate komandasi buning uçun möljallangan — u loyihangizni skanerlaydi, lokal körib çiqiş serverini oçadi va faqat tasdiqlangan özgarişlarni diskka yozadi. Töliq qöllanma: imlogram.uz/hujjatlar.",
  },
  {
    q: "Özim özgaruvçi loyihamda @imlogram/core kutubxonasini qanday ulayman?",
    a: "npm/pnpm/yarn orqali ornatib, convertToNew, convertToOld, detect kabi funksiyalarni çaqirasiz — barça funksiyalar, parametrlar va misollar imlogram.uz/hujjatlar sahifasida keltirilgan.",
  },
  {
    q: "Imlogram tekinmi va oçiq kodlimi?",
    a: "Ha, MIT litsenziyasi ostida töliq oçiq kodli, npmda va GitHub'da erkin foydalaniş mumkin.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative space-y-4 overflow-hidden py-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-400/35 via-brand-500/20 to-transparent blur-3xl dark:from-brand-500/25 dark:via-brand-600/15"
        />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
          Oçiq kodli · Kod-xavfsiz konvertatsiya
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Özbek alifbosini{" "}
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            işonçli
          </span>{" "}
          konvertatsiya qiling
        </h1>
        <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
          Oʻ/O&apos;/O` → Ö · Gʻ/G&apos;/G` → Ğ · Sh → Ş · Ch → Ç — kod, URL, email va HTML
          buzilmasdan. Pastda sinab köring.
        </p>
      </section>

      <Reveal>
        <section className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/50 sm:p-6">
          <ConverterPanel initialText="Bu shahar juda chiroyli va go'zal. Ertaga Toshkentga borib, Ishoq va Yusuf bilan uchrashaman — ular menga yangi loyiha haqida gapirib berishadi. Batafsil: https://saadahbooks.uz/donate" />
        </section>
      </Reveal>

      <section className="grid gap-4 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-3">
        <Reveal delay={0}>
          <div className="h-full rounded-xl border border-slate-200 bg-white/60 p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-brand-700">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 4.556-3.04 8.53-7.5 9.75a1.5 1.5 0 0 1-1 0C7.04 20.53 4 16.556 4 12V6.108a1.5 1.5 0 0 1 1.048-1.43l6.5-2.166a1.5 1.5 0 0 1 .904 0l6.5 2.166A1.5 1.5 0 0 1 21 6.108V12Z" />
              </svg>
            </div>
            <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">Kod-xavfsiz</h2>
            URL, email, kod bloklari va HTML teglari heç qaçon özgartirilmaydi.
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="h-full rounded-xl border border-slate-200 bg-white/60 p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-brand-700">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m17.25 6.75 4.5 5.25-4.5 5.25M6.75 6.75 2.25 12l4.5 5.25m8.25-13.5-4.5 15" />
              </svg>
            </div>
            <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">Oçiq kodli</h2>
            Konvertatsiya mantiği oçiq va npm orqali erkin işlatilişi mumkin.
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="h-full rounded-xl border border-slate-200 bg-white/60 p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-brand-700">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              </svg>
            </div>
            <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">Aniqlik</h2>
            &quot;Is&apos;hoq&quot; kabi noaniq holatlarni luğat asosida töğri ajratadi.
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-xl font-semibold text-slate-900 dark:text-slate-100">
            Köp beriladigan savollar
          </h2>
          <div className="space-y-2">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 bg-white/60 p-4 transition open:border-brand-300 open:bg-brand-50/40 open:shadow-soft dark:border-slate-800 dark:bg-slate-900/30 dark:open:border-brand-700 dark:open:bg-brand-900/10"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-800 marker:content-none dark:text-slate-200">
                  {item.q}
                  <svg
                    className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-open:text-brand-600 dark:group-open:text-brand-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/60 p-6 text-center dark:border-slate-800 dark:bg-slate-900/30 sm:p-8">
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Oçiq kodli loyiha</h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Imlogram töliq oçiq kodli — konvertatsiya mantiği uçta npm paket (
            <code>@imlogram/core</code>, <code>@imlogram/parser</code>, <code>@imlogram/cli</code>)
            sifatida hamma uçun oçiq, öz loyihangizda erkin işlatişingiz mumkin. Boşqa
            dasturçilarni ham loyihani rivojlantirişga taklif qilamiz — yangi istisno sözlari,
            bug fix yoki yangi imkoniyatlar bilan.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="https://github.com/imlogram/imlogram"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300"
            >
              GitHub&apos;da köriş
            </a>
            <a
              href="/hujjatlar"
              className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300"
            >
              Hujjatlarni öqiş
            </a>
            <a
              href="https://github.com/imlogram/imlogram/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-700"
            >
              Hissa qoşiş
            </a>
          </div>
        </section>
      </Reveal>

      <FaqStructuredData items={FAQ} />
    </div>
  );
}
