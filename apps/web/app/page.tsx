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
    a: "Converter sahifasida «Kirilça → Yangi» rejimini tanlang, matningizni joylaştiring — natija darhol çiqadi.",
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
    a: "Oçiq kodli npm paketi @imlogram/cli buning uçun möljallangan — u loyihangizni skanerlaydi, lokal körib çiqiş serverini oçadi va faqat tasdiqlangan özgarişlarni diskka yozadi.",
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
          <ConverterPanel initialText="Bu shahar juda chiroyli va go'zal. Batafsil: https://saadahbooks.uz/donate" />
        </section>
      </Reveal>

      <section className="grid gap-4 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-3">
        <Reveal delay={0}>
          <div className="h-full rounded-xl border border-slate-200 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-brand-700">
            <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">Kod-xavfsiz</h2>
            URL, email, kod bloklari va HTML teglari heç qaçon özgartirilmaydi.
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="h-full rounded-xl border border-slate-200 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-brand-700">
            <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">Oçiq kodli</h2>
            Konvertatsiya mantiği oçiq va npm orqali erkin işlatilişi mumkin.
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="h-full rounded-xl border border-slate-200 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-brand-700">
            <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">Aniqlik</h2>
            "Ishoq" kabi noaniq holatlarni luğat asosida töğri ajratadi.
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-center text-xl font-semibold text-slate-900 dark:text-slate-100">
            Köp beriladigan savollar
          </h2>
          <div className="space-y-2">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/30"
              >
                <summary className="cursor-pointer list-none font-medium text-slate-800 marker:content-none dark:text-slate-200">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Reveal>

      <FaqStructuredData items={FAQ} />
    </div>
  );
}
