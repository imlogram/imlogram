import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

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
    title: "Veb-sayt (Aylantirgiç, Aniqlagiç)",
    body: "Kiritgan matningiz standart holatda serverga yuborilmaydi va saqlanmaydi — barça konvertatsiya va aniqlaş brauzeringizning özida işlaydi.",
  },
  {
    title: "Konvertatsiya tarixi",
    body: "Aylantirgiç sahifasidagi konvertatsiya tarixi faqat brauzeringizning lokal xotirasida (localStorage) saqlanadi va heç qaçon serverga yuborilmaydi. Istagan vaqtda alohida yozuvni yoki barça tarixni öçirişingiz mumkin.",
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
    body: "Sayt Google Fonts (şrift) va Telegram Bot API dan foydalanadi. Boşqa heç qanday taşqi kuzatuv yoki reklama xizmati ulanmagan.",
  },
  {
    title: "Ma'lumotlarni öçiriş",
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
        {SECTIONS.map((s, i) => (
          <Reveal key={s.title} delay={Math.min(i * 0.05, 0.3)}>
            <section>
              <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">{s.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{s.body}</p>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
