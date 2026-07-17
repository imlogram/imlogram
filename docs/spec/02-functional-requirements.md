# 2. Functional Requirements

Har bir talab `FR-<MODULE>-<NUM>` formatida ID'ga ega. "Acceptance" — qabul qilish mezoni.

## 2.1 Converter (`FR-CONV`)

| ID | Talab | Acceptance |
|---|---|---|
| FR-CONV-01 | Foydalanuvchi matnni eski → yangi yozuvga o'tkaza oladi | Barcha digraf/apostrof variantlari to'g'ri xaritalanadi (§8) |
| FR-CONV-02 | Foydalanuvchi matnni yangi → eski yozuvga qaytara oladi | Deterministik, 100% teskari (bijektiv) jadval asosida |
| FR-CONV-03 | Kod/URL/email/struktura himoyalangan bo'ladi | 8-bo'limdagi himoyalangan-zona testlari o'tadi |
| FR-CONV-04 | Natijani bir tugma bilan nusxalash (Copy) | Clipboard API, fallback bilan |
| FR-CONV-05 | Natijani ijtimoiy tarmoqqa/link orqali ulashish (Share) | Qisqa URL yoki Web Share API |
| FR-CONV-06 | Natijani `.txt`/`.docx`/`.md` sifatida yuklab olish | Client-side generatsiya, server ishtirokisiz |
| FR-CONV-07 | Oxirgi N ta konvertatsiya tarixi saqlanadi | Anonim: localStorage; login qilingan: DB |
| FR-CONV-08 | Belgi soni, so'z soni, o'qish vaqti ko'rsatiladi | Real-time, debounce 150ms |
| FR-CONV-09 | Fayl yuklab konvertatsiya qilish (.txt, .docx, .srt, .csv) | `POST /file` orqali, 10MB limit |
| FR-CONV-10 | Katta matn (>50k belgi) UI’ni bloklamaydi | Web Worker orqali parser ishga tushiriladi |

## 2.2 Detector (`FR-DET`)

| ID | Talab | Acceptance |
|---|---|---|
| FR-DET-01 | Matn "eski", "yangi" yoki "aralash" deb tasniflanadi | Har bir sinf uchun ishonch foizi (confidence %) qaytariladi |
| FR-DET-02 | Aralash holatda qaysi qator/joyda qaysi yozuv borligi ko'rsatiladi | Highlight bilan, offset (start/end) qaytariladi |
| FR-DET-03 | Har bir maxsus harf/digraf bo'yicha statistika | `{ "sh": 12, "oʻ": 4, ... }` shaklida |

## 2.3 Website Scanner (`FR-SCAN`)

| ID | Talab | Acceptance |
|---|---|---|
| FR-SCAN-01 | Foydalanuvchi URL kiritib skanerlashni boshlaydi | Job yaratiladi, `jobId` qaytariladi (async) |
| FR-SCAN-02 | `robots.txt` va `sitemap.xml` hisobga olinadi | Robots qoidalariga rioya qilinadi (§15) |
| FR-SCAN-03 | Ichki sahifalar (bir domen doirasida) chuqurlik bo'yicha aylanadi | Default depth=3, max pages=200 (konfiguratsiya qilinadi) |
| FR-SCAN-04 | `title`, `meta description`, `body` matni tekshiriladi | Script/style/noscript chiqarib tashlanadi |
| FR-SCAN-05 | Progress real-time kuzatiladi | Polling `GET /scan/:id` yoki WebSocket |
| FR-SCAN-06 | Natija: tekshirilgan sahifalar soni, eski yozuv topilgan sahifalar, harf-bo'yicha son | Struktura §10 da |
| FR-SCAN-07 | Natijani CSV, Excel, JSON, PDF eksport qilish | Har biri alohida endpoint/tugma |
| FR-SCAN-08 | Bir xil domen uchun qayta-qayta skaner cheklanadi | Rate limit + cool-down 10 daqiqa |

## 2.4 Telegram Bot (`FR-BOT`)

| ID | Talab | Acceptance |
|---|---|---|
| FR-BOT-01 | Matn yuborilganda avtomatik yo'nalish aniqlanadi va tugmalar chiqadi | "Yangi alifboga", "Eski alifboga", "Statistika" tugmalari |
| FR-BOT-02 | `/convert`, `/detect`, `/stats`, `/help`, `/lang` komandalar | Har biri javob beradi <2s ichida (p95) |
| FR-BOT-03 | Inline mode: `@imlogram_bot matn` istalgan chatda | Inline result sifatida konvertatsiya natijasi |
| FR-BOT-04 | Foydalanuvchi tilni tanlashi mumkin (uz/ru/en interfeys) | `/lang` orqali, sessiyada saqlanadi |
| FR-BOT-05 | Kunlik foydalanish limiti (spam himoyasi) | 100 so'rov/kun/foydalanuvchi (default) |

## 2.5 REST API (`FR-API`)

| ID | Talab | Acceptance |
|---|---|---|
| FR-API-01 | `POST /convert` — matnni konvertatsiya qiladi | §12 |
| FR-API-02 | `POST /detect` — yozuv turini aniqlaydi | §12 |
| FR-API-03 | `POST /statistics` — harf statistikasi | §12 |
| FR-API-04 | `POST /scan` — sayt skanerini boshlaydi | §12 |
| FR-API-05 | `POST /file` — fayl konvertatsiyasi | §12 |
| FR-API-06 | OpenAPI 3.1 spetsifikatsiyasi avtomatik generatsiya qilinadi | `docs.imlogram.uz/api` da Swagger UI |
| FR-API-07 | API kalitlari boshqaruvi (yaratish, o'chirish, limit ko'rish) | Dashboard orqali |

## 2.6 npm Packages (`FR-PKG`)

| ID | Talab | Acceptance |
|---|---|---|
| FR-PKG-01 | `@imlogram/core` — sof TypeScript, hech qanday runtime bog'liqlik yo'q | Node, browser, edge (Cloudflare Workers) da ishlaydi |
| FR-PKG-02 | `@imlogram/react` — `useConverter()` hook va `<ImlogramText>` komponenti | SSR-safe |
| FR-PKG-03 | `@imlogram/next` — Next.js middleware/route handler helperlari | App Router va Pages Router qo'llab-quvvatlanadi |
| FR-PKG-04 | `@imlogram/cli` — terminal orqali fayl/stdin konvertatsiyasi | `imlogram convert file.txt --to=new` |
| FR-PKG-05 | Har bir paket mustaqil versiyalanadi va publish qilinadi | Changesets orqali (§18) |

## 2.7 Web Platform (`FR-WEB`)

| ID | Talab | Acceptance |
|---|---|---|
| FR-WEB-01 | Next.js App Router asosida, TypeScript, Tailwind, shadcn/ui | §14 |
| FR-WEB-02 | Dark/Light rejim, tizim afzalligini avtomatik aniqlash | `next-themes` |
| FR-WEB-03 | PWA: offline’da asosiy konverter ishlaydi | Service worker orqali `@imlogram/core` cache qilinadi |
| FR-WEB-04 | SEO: har bir sahifa uchun metadata, OpenGraph, sitemap | Next.js Metadata API |
| FR-WEB-05 | i18n: kamida uz-Latn (yangi), uz-Latn (eski), ru, en | `next-intl` |
