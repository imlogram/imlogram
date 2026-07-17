import type { Metadata } from "next";
import { DetectorPanel } from "@/components/DetectorPanel";

const TITLE = "Detector";
const DESCRIPTION = "Matnda eski, yangi yoki aralaş özbek lotin yozuvini aniqlang.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/detector" },
  openGraph: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION, url: "/detector" },
  twitter: { title: `${TITLE} · imlogram.uz`, description: DESCRIPTION },
};

export default function DetectorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Detector</h1>
      <DetectorPanel />
    </div>
  );
}
