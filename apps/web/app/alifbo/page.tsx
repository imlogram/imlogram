import type { Metadata } from "next";

const TITLE = "Alifbo";
const DESCRIPTION =
  "Yangi özbek alifbosining barça 28 harfi — bosma va yozma şaklda, eski yozuvdagi mos harflari bilan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "yangi o'zbek alifbosi",
    "o'zbek alifbosi harflari",
    "eski va yangi harflar",
    "Ö Ğ Ş Ç harflari",
    "yozma va bosma alifbo",
    "o'zbek alifbosi jadvali",
  ],
  alternates: { canonical: "/alifbo" },
  openGraph: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION, url: "/alifbo" },
  twitter: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION },
};

interface Letter {
  upper: string;
  lower: string;
  oldForm?: string;
  changed?: boolean;
}

// Rasmiy alifbo ketma-ketligi: 24 ta oddiy lotin harfi (A dan Z gaça,
// alfavitdagi joyi bilan), keyin tört ta maxsus harf (Oʻ/Gʻ/Sh/Ch —
// Ö/Ğ/Ş/Ç) — bular ALFAVIT ORTASIGA emas, aynan Z'dan keyin, alohida
// guruh sifatida keladi (1995-yilgi qonundan beri şu tartib saqlanadi).
const ALPHABET: Letter[] = [
  { upper: "A", lower: "a" },
  { upper: "B", lower: "b" },
  { upper: "D", lower: "d" },
  { upper: "E", lower: "e" },
  { upper: "F", lower: "f" },
  { upper: "G", lower: "g" },
  { upper: "H", lower: "h" },
  { upper: "I", lower: "i" },
  { upper: "J", lower: "j" },
  { upper: "K", lower: "k" },
  { upper: "L", lower: "l" },
  { upper: "M", lower: "m" },
  { upper: "N", lower: "n" },
  { upper: "O", lower: "o" },
  { upper: "P", lower: "p" },
  { upper: "Q", lower: "q" },
  { upper: "R", lower: "r" },
  { upper: "S", lower: "s" },
  { upper: "T", lower: "t" },
  { upper: "U", lower: "u" },
  { upper: "V", lower: "v" },
  { upper: "X", lower: "x" },
  { upper: "Y", lower: "y" },
  { upper: "Z", lower: "z" },
  { upper: "Ö", lower: "ö", oldForm: "Oʻ oʻ", changed: true },
  { upper: "Ğ", lower: "ğ", oldForm: "Gʻ gʻ", changed: true },
  { upper: "Ş", lower: "ş", oldForm: "Sh sh", changed: true },
  { upper: "Ç", lower: "ç", oldForm: "Ch ch", changed: true },
];

const CHANGED = ALPHABET.filter((l) => l.changed);

function LetterCard({ letter }: { letter: Letter }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center transition ${
        letter.changed
          ? "border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/20"
          : "border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/30"
      }`}
    >
      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        {letter.upper} {letter.lower}
      </div>
      <div className="font-cursive mt-1 text-3xl text-brand-600 dark:text-brand-300">
        {letter.upper} {letter.lower}
      </div>
      {letter.oldForm ? (
        <div className="mt-2 text-xs text-slate-500">
          eski: <span className="font-medium">{letter.oldForm}</span>
        </div>
      ) : (
        <div className="mt-2 text-xs text-slate-400">özgarmagan</div>
      )}
    </div>
  );
}

export default function AlifboPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alifbo</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Yangi özbek lotin alifbosi 28 ta harfdan iborat. Tortta harf eski yozuvdagi digraf
          yoki apostrofli birikmalar örnida yagona harfga aylandi — bosma (odatdagi) va yozma
          (qölda yoziladigan) şakllari pastda körsatilgan. Maxsus harflar alfavitning ortasiga
          emas, aynan Z&apos;dan keyin, alohida guruh sifatida keladi.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Özgargan tört harf</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CHANGED.map((letter) => (
            <LetterCard key={letter.upper} letter={letter} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Töliq jadval (rasmiy ketma-ketlikda)</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7">
          {ALPHABET.map((letter) => (
            <LetterCard key={letter.upper} letter={letter} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white/60 p-5 dark:border-slate-800 dark:bg-slate-900/30">
        <h2 className="mb-3 text-lg font-semibold">Harflar soni: tarixiy özgariş</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-900/50">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">31</div>
            <div className="mt-1 text-xs text-slate-500">
              1993-yilgi dastlabki loyiha — <code>Ñ</code>, <code>Ç</code>, <code>Ğ</code>,{" "}
              <code>Ö</code>, <code>Ş</code> va nuqtali/nuqtasiz <code>I/ı</code> bilan
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-900/50">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">28</div>
            <div className="mt-1 text-xs text-slate-500">
              1995–2026: <code>sh</code>, <code>ch</code>, <code>o&apos;</code>,{" "}
              <code>g&apos;</code> digraf va apostrof bilan yozilgan
            </div>
          </div>
          <div className="rounded-lg bg-brand-50 p-3 text-center dark:bg-brand-900/20">
            <div className="text-2xl font-bold text-brand-700 dark:text-brand-300">28</div>
            <div className="mt-1 text-xs text-brand-700/80 dark:text-brand-300/80">
              2026 islohotidan keyin — ş, ç, ğ, ö yagona harf sifatida
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Harflar soni özi 28 bölib qoladi — özgargani faqat tört harfning yozilişi (ikki
          belgidan bitta belgiga). Dastlabki 1993-yilgi loyihada alohida <code>Ñ</code> («ng»)
          harfi ham bor edi, biroq u 1995-yilgi tuzatişda alifbodan çiqarib taşlandi — hozir bu
          tovuş alohida harf emas, n+g birikmasi sifatida yoziladi (masalan: <em>tong</em>,{" "}
          <em>singil</em>).
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white/60 p-5 dark:border-slate-800 dark:bg-slate-900/30">
        <h2 className="mb-2 text-lg font-semibold">Tutuq belgisi (ʼ)</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tutuq belgisi 28 harfga kirmaydi — bu alohida tiniş belgisi, biroq imloda muhim röl
          öynaydi. Eski yozuvda apostrof ikki xil vazifani bajargan: (1){" "}
          <code>o&apos;</code>/<code>g&apos;</code> digraflarining bir qismi sifatida va (2)
          arab-fors kelib çiqişli sözlarda tutuq tovuşini bildiriş uçun (masalan:{" "}
          <strong>san&apos;at</strong>, <strong>ma&apos;no</strong>,{" "}
          <strong>e&apos;lon</strong>). Bu ikki xil vazifa köpinça çalkaşliklarga sabab bölgan.
          2026 islohotidan keyin oʻ/gʻ öz-özidan Ö/Ğ harflariga aylangani uçun, tutuq belgisi
          endi faqat bitta vazifani — tutuq tovuşini — bildiradi.
        </p>
      </section>

      <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
        <h2 className="mb-2 text-lg font-semibold text-amber-900 dark:text-amber-200">
          Istisnolar: ş yoki ç har doim ham digraf emas
        </h2>
        <p className="text-sm text-amber-900/90 dark:text-amber-200/90">
          Ba&apos;zi sözlarda <code>sh</code> yoki <code>ch</code> ikki mustaqil undoşni
          bildiradi, digraf emas. Masalan <strong>Ishoq</strong> ismida <em>s</em> va{" "}
          <em>h</em> alohida talaffuz qilinadi (Is-hoq), şuning uçun u <strong>Ishoq</strong>{" "}
          bölib qoladi, <strong>Işoq</strong> emas. Imlogram bunday sözlarni kiçik, kengaytiriladigan
          istisnolar lug&apos;ati orqali töğri aniqlaydi —{" "}
          <a
            href="https://github.com/imlogram/imlogram/blob/main/docs/spec/08-parser-design.md"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-100"
          >
            batafsil
          </a>
          .
        </p>
      </section>
    </div>
  );
}
