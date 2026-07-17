import type { Metadata } from "next";
import { ConverterPanel } from "@/components/ConverterPanel";

const TITLE = "Converter";
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Converter</h1>
      <ConverterPanel />
    </div>
  );
}
