# 14. UI/UX Structure

## Sayt xaritasi (`apps/web`, Next.js App Router)

```
/                       Landing (mahsulot tanishtiruvi, tezkor converter widget)
/converter               To'liq Converter sahifasi
/detector                 Detector sahifasi
/scanner                   Scanner kirish (URL kiritish)
/scanner/[jobId]            Scan natijasi, progress, eksport tugmalari
/pricing                     API/Scanner tariflar (v1.5+)
/dashboard                    (auth) Umumiy ko'rinish
/dashboard/api-keys            (auth) API kalitlar boshqaruvi
/dashboard/history              (auth) Konvertatsiya/scan tarixi
/login, /register                 Auth
```

`docs.imlogram.uz` va `status.imlogram.uz` — alohida ilovalar (§5), lekin bir xil dizayn
tizimidan (`packages/ui`) foydalanadi.

## Dizayn tizimi

- **Tailwind CSS** + **shadcn/ui** — komponentlar nusxalanadi va `packages/ui` ichida
  loyihaga moslashtiriladi (shadcn falsafasiga mos — "copy, not dependency").
- Ranglar, tipografiya, bo'shliqlar — `dataviz`/umumiy dizayn tamoyillariga mos, brand
  rangi sifatida lotin-yozuv mavzusiga mos ko'k-yashil gradient (aniq palitra dizayn
  bosqichida tasdiqlanadi, hozircha shadcn "zinc" bazasi + bitta accent rang).
- **Dark mode** — `next-themes`, `class` strategiyasi, tizim afzalligini default oladi.
- Shrift: lotin belgilarni (Ö, Ğ, Ş, Ç) to'liq qo'llab-quvvatlaydigan variable font
  (masalan Inter yoki Manrope — ikkalasi ham kengaytirilgan lotin diapazonini qamraydi).

## Converter sahifasi — asosiy komponent

```
┌─────────────────────────────────────────────────────────┐
│  [Eski → Yangi]  [Yangi → Eski]  [Avtomatik aniqlash]    │  ← Segmented control
├───────────────────────────┬───────────────────────────────┤
│  Kirish matni              │  Natija                       │
│  (textarea, auto-grow)     │  (o'zgargan qismlar highlight) │
│                             │                                │
├───────────────────────────┴───────────────────────────────┤
│  124 belgi · 21 so'z · ~1 daq o'qish   [Copy] [Share] [↓]  │
└─────────────────────────────────────────────────────────┘
```

- Real-time konvertatsiya, 150ms debounce, Web Worker orqali (UI thread bloklanmaydi).
- O'zgargan qismlar `<mark>` bilan yengil fon rangda belgilanadi (ixtiyoriy toggle
  "O'zgarishlarni ko'rsatish").
- Mobil: ikki panel vertikal stack bo'ladi, swipe orqali almashtiriladi.

## Scanner natija sahifasi

- Progress bar + jonli sahifa hisoblagichi (polling 2s interval, `GET /scan/:id`).
- Xulosa kartochkalari: "Tekshirilgan sahifalar", "Eski yozuv topilgan", "Eng ko'p uchragan
  harf" — `dataviz` ko'nikmasiga mos stat-tile uslubida.
- Sahifalar jadvali: URL, holat, topilgan harflar soni, "Ko'rish" linki (asl sahifaga).
- Eksport tugmalari: CSV / Excel / JSON / PDF — har biri alohida so'rov, progress toast bilan.

## Accessibility (§3 bilan bog'liq)

- Har bir interaktiv element uchun `aria-label`, natija paneli `aria-live="polite"`.
- Klaviatura qisqa yo'llari: `Cmd/Ctrl+Enter` — konvertatsiya, `Cmd/Ctrl+K` — yo'nalishni
  almashtirish.
- Kontrast tekshiruvi CI’da avtomatik (`axe-core` Playwright plugin, §16).

## i18n

- `next-intl`, locale segmenti URL’da: `imlogram.uz/ru/converter`, default locale
  (`uz-new`) prefiks olmaydi.
- Interfeys matnlari 4 tilda: `uz-new` (standart), `uz-old`, `ru`, `en`.
- Muhim: interfeys tili bilan **konvertatsiya funksiyasi mustaqil** — rus tilidagi
  interfeysda ham o'zbekcha matnni konvertatsiya qilish mumkin.

## Responsive breakpointlar

Tailwind default (`sm 640 / md 768 / lg 1024 / xl 1280`) — Converter va Scanner sahifalari
`md`dan boshlab ikki-panel layout’ga o'tadi, undan past — bitta ustun.

## PWA

- `manifest.json` + service worker (Workbox yoki Next PWA plugin).
- Offline’da: Converter va Detector to'liq ishlaydi (`@imlogram/core` cache qilingan);
  Scanner va Dashboard tarmoq talab qilgani uchun offline holatda "Internetga ulaning"
  bildirishnomasi ko'rsatadi.
