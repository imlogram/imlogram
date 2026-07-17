# 3. Non-Functional Requirements

## Performance

| Metrika | Maqsad |
|---|---|
| `@imlogram/core` konvertatsiya tezligi | ≥ 20 MB/s matn uchun single-thread (V8, tekis matn) |
| Parser latency (1000 belgi) | < 5ms p95 |
| `POST /convert` API javob vaqti | < 100ms p95 (matn ≤ 10k belgi) |
| Web converter — birinchi natija | < 150ms (debounce 150ms + client parse) |
| Scanner — sahifa/soniya | ≥ 3 sahifa/s (domenga nisbatan siyosat cheklovlarida) |
| Web LCP (Largest Contentful Paint) | < 2.0s (3G Fast, mobil) |
| Bundle size — `@imlogram/core` (min+gzip) | < 15KB |

## Scalability

- Stateless API instansiyalari — gorizontal masshtablanadi (Kubernetes/Fly.io/Render).
- Scanner ishlari BullMQ orqali navbatga qo'yiladi — worker soni mustaqil masshtablanadi.
- Redis — rate-limit va queue backend; Postgres — read replica bilan kengaytiriladi (v2.0).
- Katta matnlar uchun streaming/chunked konvertatsiya (v1.5+).

## Availability & SLA

- `api.imlogram.uz` — 99.5% oylik uptime maqsadi (MVP/v1), 99.9% (v2.0, ko'p regionli).
- `status.imlogram.uz` — jamoatchilik uchun real-time holat sahifasi (Better Stack/Instatus
  uslubida, o'z-o'zidan joylashtiriladi yoki minimal NestJS xizmat sifatida).
- Graceful degradation: agar backend ishlamasa, veb-saytdagi Converter client-side
  `@imlogram/core` bilan ishlashda davom etadi (offline-first dizayn).

## Accessibility

- WCAG 2.1 AA darajasi barcha ommaviy sahifalarda.
- Klaviatura orqali to'liq navigatsiya, fokus holatlari ko'rinadi.
- Kontrast nisbati ≥ 4.5:1 (matn), ≥ 3:1 (UI komponentlar).
- Screen reader uchun ARIA-live regionlar (konvertatsiya natijasi o'zgarganda e'lon qilinadi).

## Internationalization

- Interfeys tillari: o'zbek (yangi lotin, standart), o'zbek (eski lotin), rus, ingliz.
- Barcha sana/son formatlari `Intl` API orqali locale-aware.
- Kontent tarjimasi `next-intl` + JSON resurs fayllari, tarjima yo'qolgan holatlar uchun
  fallback zanjiri (uz-new → uz-old → en).

## Security & Privacy

- Batafsil §15 da. Qisqacha: rate limiting, input validation, XSS/CSRF/SSRF himoyasi,
  API kalitlari hash qilinib saqlanadi, foydalanuvchi matni default holatda **saqlanmaydi**
  (faqat agar "History"ga ruxsat bergan bo'lsa).
- GDPR-uslubidagi ma'lumot minimizatsiyasi: konvertatsiya so'rovlari 30 kundan keyin log’lardan
  o'chiriladi (anonimlashtirilgan metrikalardan tashqari).

## Observability

- Structured logging (pino) — JSON format, request-id korrelyatsiyasi.
- OpenTelemetry orqali trace’lar (API → queue → worker zanjiri kuzatiladi).
- Metrikalar: Prometheus format, Grafana dashboard (konvertatsiya soni, xatolik darajasi,
  scanner navbat uzunligi).
- Xatoliklar: Sentry (yoki self-hosted GlitchTip) integratsiyasi.

## Compatibility

- Brauzerlar: so'nggi 2 versiya (Chrome, Firefox, Safari, Edge) + iOS Safari 15+.
- Node.js: 18 LTS va undan yuqori (`@imlogram/node`).
- Edge runtime: Cloudflare Workers, Vercel Edge — `@imlogram/core` Web API’dan tashqari
  hech narsaga bog'liq bo'lmasligi kerak.

## Maintainability

- TypeScript `strict: true` barcha paketlarda.
- Har bir paket uchun min. 90% test coverage (`@imlogram/parser` uchun 95%+).
- ESLint + Prettier + commitlint (Conventional Commits) majburiy (pre-commit hook, Husky yoki
  lefthook).
