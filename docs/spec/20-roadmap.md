# 20. Development Roadmap

## MVP (6-8 hafta) — "Parser to'g'ri ishlashini isbotlash"

Maqsad: asosiy konvertatsiya mexanizmi ishonchli ekanini ko'rsatish, tashqi bog'liqlik
(auth, DB, queue) minimal.

- `@imlogram/core` + `@imlogram/parser` — to'liq §8-9 dagi dizayn, 500+ fixture test.
- `apps/web`: faqat Converter + Detector sahifalari, **client-side only** (API’siz),
  localStorage tarix.
- Dark mode, responsive, asosiy SEO.
- CI: lint/typecheck/test/build (§17 asosiy qismi).
- Hech qanday auth, DB, backend deploy yo'q — statik/Vercel Edge’da to'liq ishlaydi.
- **Chiqish mezoni**: 500+ test yashil, real-dunyo corpus’da 99%+ aniqlik, ichki demo.

## v1.0 — "Platforma"

- `apps/api` (NestJS) ishga tushadi: `/convert`, `/detect`, `/statistics`, `/file`
  endpoint’lari, anonim + API-key auth, rate limiting (§15.1).
- PostgreSQL + Prisma, `User`/`ApiKey` modellari.
- Dashboard: ro'yxatdan o'tish, API kalit yaratish.
- npm nashri: `@imlogram/core`, `@imlogram/node`, `@imlogram/browser`, `@imlogram/react`
  — `latest` tag bilan v1.0.0.
- `docs.imlogram.uz` ishga tushadi (Swagger UI + paket hujjatlari).
- Testlar 1000+ ga yetkaziladi (himoyalangan zonalar, istisnolar lug'ati kengaytiriladi).
- CI/CD to'liq (§17), Docker deploy (staging + production, qo'lda tasdiqlash bilan).
- **Chiqish mezoni**: API 99.5% uptime, 10+ tashqi dasturchi API kalit olgan.

## v1.5 — "Kengayish"

- Website Scanner to'liq ishga tushadi: `apps/workers`, BullMQ, crawler (§10), CSV/Excel/
  JSON/PDF eksport.
- Telegram bot (§11): komandalar, inline mode, statistikalar.
- `@imlogram/next`, `@imlogram/cli` nashr qilinadi.
- Dashboard: konvertatsiya/scan tarixi, foydalanish statistikasi.
- i18n to'liq (ru, en interfeys).
- PWA offline rejimi.
- `status.imlogram.uz` ishga tushadi.
- **Chiqish mezoni**: 20+ sayt skaner qilingan, bot 1000+ faol foydalanuvchi.

## v2.0 — "Standart"

- Ko'p regionli deploy (99.9% SLA maqsadi).
- Enterprise API kalitlar: yuqori rate-limit, SLA, dedicated support.
- Scanner: webhook callback’lar (job tugaganda), rejalashtirilgan (scheduled) qayta-skaner
  (masalan haftalik monitoring).
- Bot: fayl yuklash, guruh chat integratsiyasi.
- Statistik/ML-asoslangan istisno aniqlash tadqiqoti (§9.3’da qayd etilgan kelajak yo'nalishi)
  — dictionary yondashuvini to'ldiruvchi, almashtiruvchi emas.
- Qo'shimcha framework SDK’lari (masalan `@imlogram/vue`), community talabiga qarab.
- Kengaytirilgan Detector: fayl/hujjat darajasida (Google Docs, Word) plugin integratsiyasi
  tadqiqoti.
- **Chiqish mezoni**: §1 dagi 12-oylik muvaffaqiyat mezonlari (500+ GitHub yulduz, 50+ tashqi
  loyihada ishlatilishi va h.k.) bajarilgan.

## Doimiy (har bosqichda parallel davom etadi)

- Istisnolar lug'atini hamjamiyat bilan birga kengaytirish (§8.4, §19 contributing).
- Xavfsizlik va bog'liqlik yangilanishlari (Dependabot, CodeQL).
- Real-dunyo corpus’ni yangilab test to'plamini boyitish.
