import type { Metadata } from "next";
import { DetectorPanel } from "@/components/DetectorPanel";

const TITLE = "Aniqlagiç";
const DESCRIPTION = "Matnda eski, yangi yoki aralaş özbek lotin yozuvini aniqlang.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "eski yozuvni aniqlash",
    "yangi alifbo tekşiruvçi",
    "aralaş yozuvni topish",
    "matn tahlili o'zbek",
    "imlo tekşiruvçi",
  ],
  alternates: { canonical: "/detector" },
  openGraph: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION, url: "/detector" },
  twitter: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION },
};

export default function DetectorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Aniqlagiç</h1>
      <DetectorPanel />
    </div>
  );
}
