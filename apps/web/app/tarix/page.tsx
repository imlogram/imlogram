import type { Metadata } from "next";

const TITLE = "Tarix";
const DESCRIPTION =
  "Özbek yozuvi tarixi: arab yozuvidan Yanalifga, kirilçadan lotinga, va bugungi yangi alifboga qadar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "o'zbek yozuvi tarixi",
    "yanalif",
    "o'zbek alifbosi islohoti",
    "kirillikdan lotinga",
    "yangi o'zbek alifbosi tarixi",
  ],
  alternates: { canonical: "/tarix" },
  openGraph: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION, url: "/tarix" },
  twitter: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION },
};

interface Era {
  year: string;
  title: string;
  body: string;
}

const TIMELINE: Era[] = [
  {
    year: "— 1929",
    title: "Arab yozuvi",
    body: "1929-yilgaça özbek tilida arab yozuvi asosidagi imlo qöllanilgan.",
  },
  {
    year: "1929",
    title: "Birinçi lotin alifbosi (Yanalif)",
    body: "Arab yozuvi örnini lotin grafikasiga asoslangan Yanalif egalladi.",
  },
  {
    year: "1940",
    title: "Kirill yozuviga ötiş",
    body: "Siyosiy qarorga köra özbek yozuvi kirill grafikasiga ötkazildi. Bu yozuv qariyb ellik yil davomida rasmiy holatda qoldi.",
  },
  {
    year: "1993–1995",
    title: "Mustaqillikdan keyingi lotin islohoti",
    body: "Özbekiston mustaqillikka erişgaç, lotin yozuviga qaytiş töğrisida qonun qabul qilindi — dastlabki 1993-yilgi loyihada 31 ta harf bor edi, jumladan alohida Ñ («ng») harfi ham bor edi. 1995-yilda esa alifbo 28 ta harfga tuşirilib tuzatildi — hozirgi gʻ, sh, ch kabi digraf va apostrofli harflar şu bosqiçda şakllandi, Ñ esa alifbodan çiqarib taşlanib n+g birikmasiga aylandi (masalan: tong, singil).",
  },
  {
    year: "2019",
    title: "Yangilangan alifbo taklifi",
    body: "Til mutaxassislari tomonidan Sh, Ch, Gʻ, Oʻ örnida yagona harflar (Ş, Ç, Ğ, Ö) işlatilişini nazarda tutgan yangi loyiha taklif etildi — maqsad talaffuz va yozuv orasidagi mosligini oşiriş edi.",
  },
  {
    year: "2021",
    title: "Qisman tuzatiş",
    body: "Taklif qonun hujjatlariga qisman kiritildi, biroq amaliyotda eski va yangi yozuv aralaş holda işlatilişda davom etdi.",
  },
  {
    year: "2026-yil iyul",
    title: "Qonun loyihasi Senatga yuborildi",
    body: "Ö, Ğ, Ş, Ç harflarini rasmiylaştiriş töğrisidagi qonun loyihasi Qonunçilik palatasida ma'qullanib, Senatga yuborildi — hali yakuniy qonun sifatida qabul qilinmagan. Imlogram.uz aynan şu kutilayotgan yangi standartga asoslangan.",
  },
  {
    year: "Bugun",
    title: "Ikki yozuv yonma-yon",
    body: "Hozirda ikkala yozuv ham amalda uçraydi. Imlogram bu ikki yozuv orasidagi köpayotgan farqni kod-xavfsiz tarzda birlaştiriş uçun yaratildi.",
  },
];

const REASONS: { title: string; body: string }[] = [
  {
    title: "Raqamlaştiriş va sun'iy intellekt",
    body: "O'/G' harflarining yettitagaça xil apostrof varianti katta til modellari uçun bitta sözni bir neça \"token\"ga bölib yuboradi — bu SI xizmatlaridan foydalanişni qimmatlaştiradi va qidiruv tizimlarida çalkaşlik yaratadi.",
  },
  {
    title: "Ijtimoiy tarmoq va qidiruv muammolari",
    body: "Apostrof tiniş belgisi sifatida qabul qilingani uçun haştaglar (masalan #O'zbekiston) yarim uzilib qoladi, familiyalarni turli apostrof bilan qidiriş esa natija bermaydi.",
  },
  {
    title: "Öqiş tezligi",
    body: "Inson miyasi sözni yaxlit şakl sifatida qabul qiladi; sh/ch kabi qöşharflar va apostroflar bu yaxlitlikni buzadi. Şu sababli ijtimoiy tarmoqlarda \"sh\" örniga \"w\", \"ch\" örniga \"4\" işlatiş odat tusiga kirgan.",
  },
  {
    title: "Klaviatura muammo emas",
    body: "Hozirgi kirill alifbosidagi Ў, Қ, Ғ, Ҳ harflari ham standart klaviaturada yöq, şunga qaramay muammosiz işlatiladi — yangi harflar uçun ham şunga öxşaş teriş tizimi kifoya.",
  },
  {
    title: "Bu \"taqlid\" emas",
    body: "Ş va Ç harflari 1920–30-yillardagi jadid bobolarimiz yaratgan asl lotin alifbosida aynan şu körinişda bölgan — bu qaytiş, taqlid emas.",
  },
  {
    title: "\"Ng\" harfi haqida",
    body: "Bu tovuş kirill alifbosida ham alohida harf sifatida bölmagan, va yangi alifboda ham yöqolib ketmaydi — n+g birikmasi sifatida yozilişda va öqişda davom etadi.",
  },
];

export default function TarixPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tarix</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Özbek yozuvi tarixi bir neça bor tubdan özgargan — arab yozuvidan lotinga, lotindan
          kirillga, va yana lotinga.
        </p>
      </div>

      <ol className="relative space-y-8 border-s border-slate-200 pl-6 dark:border-slate-800">
        {TIMELINE.map((era) => (
          <li key={era.year + era.title} className="relative">
            <span className="absolute -left-[1.95rem] top-1 h-3 w-3 rounded-full border-2 border-brand-500 bg-white dark:bg-slate-950" />
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
              {era.year}
            </div>
            <h2 className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">{era.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{era.body}</p>
          </li>
        ))}
      </ol>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Nega bu muhim?</h2>
        <p className="mb-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Alifbo isloh etilişi nima uçun zarurligi haqida köplab tahlillar çop etilgan. Quyida
          asosiy sabablar qisqaça keltirilgan — töliq maqola pastdagi manbada.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((r) => (
            <div key={r.title} className="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/30">
              <h3 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{r.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{r.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Manba: Orif Tolib, &laquo;&quot;Yoziw 4indan&quot; qiyinlaşganda: alifbo islohoti nega
          muhim?&raquo;, Daryo.uz, 08.07.2026 —{" "}
          <a
            href="https://daryo.uz/xPodjmLDR/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-brand-600 dark:hover:text-brand-300"
          >
            töliq maqolani öqiş
          </a>
          .
        </p>
      </section>
    </div>
  );
}
