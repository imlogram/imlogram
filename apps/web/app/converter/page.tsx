import type { Metadata } from "next";
import { ConverterPanel } from "@/components/ConverterPanel";
import { FileConverter } from "@/components/FileConverter";

const TITLE = "Aylantirgiç";
const DESCRIPTION = "Eski va yangi özbek lotin alifbosi orasida matnni konvertatsiya qiling.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "yangi alifboga o'tkazish",
    "eskidan yangi alifboga o'tkazish",
    "yangi o'zbek alifbosi",
    "kirilchadan yangi alifboga o'tkazish",
    "kirilchadan lotinchaga o'tkazish",
    "kirillikdan lotinlikka",
    "matnni konvertatsiya qilish",
    "online alifbo konvertor",
    "eski yozuvni yangi yozuvga",
  ],
  alternates: { canonical: "/converter" },
  openGraph: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION, url: "/converter" },
  twitter: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION },
};

export default function ConverterPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Aylantirgiç</h1>
        <ConverterPanel />
      </div>

      <div className="space-y-3 border-t border-slate-200 pt-8 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Fayl yuklab konvertatsiya qiliş
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Word (.docx) yoki Excel (.xlsx) faylingizni yuklang — matn içidagi formatlaş
          buzilmasdan, faqat yozuv özgaradi. Hammasi brauzeringizda işlaydi, fayl serverga
          yuborilmaydi.
        </p>
        <FileConverter />
      </div>
    </div>
  );
}
