import type { Metadata } from "next";

const TITLE = "Maxfiylik siyosati";
const DESCRIPTION = "imlogram.uz saytida va @imlogrambot Telegram botida qanday ma'lumot yiğilişi haqida.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/maxfiylik" },
  openGraph: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION, url: "/maxfiylik" },
  twitter: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION },
};

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Veb-sayt (Converter, Detector)",
    body: "Kiritgan matningiz standart holatda serverga yuborilmaydi va saqlanmaydi — barça konvertatsiya va aniqlaş brauzeringizning özida (client-side) işlaydi.",
  },
  {
    title: "Telegram bot",
    body: "Bot sizning Telegram foydalanuvçi identifikatoringiz (ID), username, ism va til kodingizni SQLite ma'lumotlar bazasida saqlaydi — botdan foydalaniş tarixini yuritiş uçun. Bot orqali yuborgan matningizning özi saqlanmaydi, faqat konvertatsiyalar soni hisoblanadi.",
  },
  {
    title: "Fikr-mulohaza (/fikr)",
    body: "Fikr komandasi orqali yuborgan xabaringiz belgilangan Telegram kanaliga sizning ismingiz va foydalanuvçi ID bilan birga yuboriladi.",
  },
  {
    title: "A'zolik talabi",
    body: "Botdan foydalaniş uçun kanalga a'zo bölişingiz talab qilinadi — a'zolik holati Telegram API orqali tekşiriladi, alohida saqlanmaydi.",
  },
  {
    title: "Uçinçi tomonlar",
    body: "Sayt Google Fonts (şrift) va Telegram Bot API dan foydalanadi. Boşqa heç qanday taşqi kuzatuv (analytics) yoki reklama xizmati ulanmagan.",
  },
  {
    title: "Ma'lumotlarni o'çiriş",
    body: "Botdagi ma'lumotlaringizni öçirişni istasangiz, @SaidqodirxonUz orqali murojaat qiling.",
  },
  {
    title: "Boğlaniş",
    body: "Savollar böyiça: @SaidqodirxonUz yoki loyihaning GitHub sahifasidagi Issues bölimi orqali.",
  },
];

export default function MaxfiylikPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Maxfiylik siyosati</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Bu sahifa imlogram.uz saytida va @imlogrambot Telegram botida qanday ma&apos;lumot
          yiğilişini tuşuntiradi.
        </p>
      </div>

      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{s.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
