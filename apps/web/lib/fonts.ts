import { Caveat } from "next/font/google";

// Used only on /alifbo to render the "yozma" (cursive/handwritten) letter
// forms alongside the printed ones — scoped via --font-cursive, not applied
// site-wide. Next.js forbids non-whitelisted exports from layout.tsx/page.tsx
// files, so this lives in its own module.
export const cursiveFont = Caveat({ subsets: ["latin-ext"], variable: "--font-cursive" });
