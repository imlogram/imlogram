import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "imlogram.uz — Özbek alifbosi konvertatsiyasi",
    short_name: "imlogram",
    description:
      "Eski va yangi özbek lotin alifbosi orasida matnlarni işonçli konvertatsiya qiling, aniqlang va tekşiring.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icon.png", sizes: "600x600", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "600x600", type: "image/png", purpose: "maskable" },
    ],
  };
}
