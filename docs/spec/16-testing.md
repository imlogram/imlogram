# 16. Testing Strategy

## Piramida

```
        /\        E2E (Playwright) — asosiy foydalanuvchi oqimlari
       /  \
      /----\      Integration (Vitest + supertest) — API modullari, DB
     /------\
    /--------\    Unit (Vitest) — @imlogram/core, parser, har bir servis
   /----------\
```

## Unit — `@imlogram/core` va `@imlogram/parser` (1000+ test)

- **Fixture-based**: `packages/core/test/fixtures/*.json` — har biri
  `{ input, expected, direction, description }` shaklida. Kategoriyalar:
  - Asosiy digraf/apostrof konvertatsiyasi (barcha jadval kombinatsiyalari, §8.1) — ~150 test
  - Apostrof Unicode variantlari (7 variant × oʻ/gʻ × katta/kichik) — ~60 test
  - Case-pattern saqlash (Title/UPPER/lower/aralash) — ~100 test
  - Himoyalangan zonalar: URL, email, kod blok, HTML, JSON, front-matter — ~200 test
  - Istisnolar lug'ati (chegara holatlar, §8.4) — lug'at o'sishi bilan o'sadi
  - Real-dunyo corpus: yangiliklar saytlaridan olingan (litsenziyaga mos, anonimlashtirilgan)
    haqiqiy paragraflar — ~300 test
  - Reversibility (round-trip) invariantlari — quyida
  - Edge case: bo'sh matn, faqat bo'shliq, faqat tinish belgilari, juda uzun so'z, emoji,
    aralash til (o'zbek+rus+ingliz bitta matnda) — ~100 test
- **Property-based/fuzz testing** (`fast-check`): tasodifiy generatsiya qilingan matnlar
  uchun invariantlar tekshiriladi:
  - `convertToOld(convertToNew(x)) === normalize(x)` (yangi→eski→yangi yo'nalishda barqaror,
    §9.3).
  - Himoyalangan zonalar (masalan tasodifiy generatsiya qilingan URL) hech qachon
    o'zgarmasligi.
  - Chiqish uzunligi kirish uzunligidan "mantiqan" chetlashmasligi (digraf → bitta belgi
    bo'lgani uchun qisqaradi, lekin nazorat qilinadigan chegarada).

## Integration — API (`apps/api`)

- Har bir controller uchun `supertest` bilan HTTP darajasidagi test: to'g'ri status kod,
  DTO validatsiyasi, rate-limit header’lari, xato formati (RFC 7807).
- Test DB: Docker Compose orqali izolyatsiyalangan Postgres, har test suite oldidan
  migratsiya + seed.
- Scan oqimi: BullMQ `test` rejimida (in-memory yoki `bullmq`’ning test util’lari) —
  crawler tarmoq so'rovlari `nock`/`msw` bilan mock qilinadi (haqiqiy internetga chiqmaydi).

## E2E — `apps/web` (Playwright)

Asosiy foydalanuvchi oqimlari:

1. Landing → Converter → matn kiritish → natijani ko'rish → Copy.
2. Detector → aralash matn → highlight to'g'ri ko'rsatilishi.
3. Scanner → URL kiritish → progress → natija → CSV eksport yuklab olish.
4. Auth → ro'yxatdan o'tish → API key yaratish → dashboard’da ko'rish.
5. Dark mode toggle, til almashtirish (i18n) — vizual regressiya (`toHaveScreenshot`).
6. Accessibility: `@axe-core/playwright` — har bir asosiy sahifada avtomatik audit,
   critical/serious darajadagi buzilishlar CI’ni to'xtatadi.

## Crawler test

- `apps/workers` uchun: robots.txt parsing, depth/limit cheklovlari, SSRF himoyasi
  (§15.3) — barchasi mock HTTP server (`msw`/local fixture server) bilan, haqiqiy tashqi
  saytlarga so'rov yubormasdan.

## Performance benchmark

- `tinybench` orqali `packages/core` uchun mikro-benchmark: 1KB/10KB/100KB/1MB matn
  uchun konvertatsiya vaqti — CI’da threshold bilan (masalan 100KB < 50ms), regressiya
  aniqlansa PR’da ogohlantirish (GitHub Action comment).
- Load test (`k6` yoki `autocannon`) — `POST /convert` uchun p95/p99 latency, staging
  muhitida release oldidan qo'lda ishga tushiriladi (avtomatik CI gate emas, chunki
  infratuzilma resurs talab qiladi).

## Coverage maqsadlari

| Paket/App | Maqsad |
|---|---|
| `@imlogram/core`, `@imlogram/parser` | ≥ 95% |
| `apps/api` | ≥ 85% |
| `apps/workers` | ≥ 80% |
| `apps/web` (unit qism) | ≥ 70%, qolgani E2E bilan qoplanadi |

Coverage `vitest --coverage` (v8 provider) orqali, Codecov’ga yuklanadi, PR’da diff-coverage
kommentariyasi qo'yiladi.
