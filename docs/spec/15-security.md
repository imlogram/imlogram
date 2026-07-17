# 15. Security Strategy

## 15.1 Rate Limiting

- Redis-backed token bucket, NestJS interceptor (`@nestjs/throttler` yoki maxsus middleware).
- Kalitlar: `ip`, `userId`, `apiKeyId` — eng cheklovchisi qo'llaniladi.
- Scanner uchun alohida, qattiqroq limitlar (§10) — chunki tashqi resurslarga ta'sir qiladi.
- `429` javobida `Retry-After` header majburiy.

## 15.2 Input Validation

- Har bir DTO **zod** sxemasi bilan tasdiqlanadi (NestJS’da `ZodValidationPipe`, class-validator
  o'rniga — TypeScript tipi bilan runtime sxemani bitta manbadan olish uchun).
- Matn uzunligi qat'iy cheklanadi (`/convert`: anonim 5k, auth 100k belgi) — DoS’ning oddiy
  shaklini oldini olish uchun.
- URL input (`/scan`) — faqat `http`/`https` protokol, boshqa sxemalar (`file://`, `ftp://`)
  rad etiladi.

## 15.3 SSRF himoyasi (Scanner uchun kritik)

Scanner tashqi URL’larni fetch qiladigan yagona komponent — shu bois eng yuqori xavf shu
yerda:

- Fetch qilishdan oldin DNS-resolve qilinadi va IP tekshiriladi: **private/loopback/link-local**
  diapazonlar (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`,
  `::1`, `fc00::/7`) rad etiladi.
- **DNS rebinding** himoyasi: resolve qilingan IP fetch vaqtida qayta tekshiriladi (TTL=0
  domenlar bilan target IP so'rov jo'natilgandan keyin o'zgarishi mumkin) — fetch library
  darajasida IP pinning qo'llaniladi (masalan `undici` bilan custom `Agent` + IP tekshiruvi).
- Redirect zanjiri kuzatiladi, har bir redirect qadamida xuddi shu tekshiruv qayta ishlaydi
  (max 5 redirect).
- Portlar: faqat 80/443 ga ruxsat (boshqa portlar — ichki xizmatlarga hujum vektori).

## 15.4 XSS

- API — faqat JSON qaytaradi, HTML render qilmaydi → XSS sirti minimal.
- Web (`apps/web`) — React default escaping’ga tayanadi; Scanner natijalarida **tashqi
  saytdan olingan `title`/`meta`** matni ko'rsatilganda `dangerouslySetInnerHTML`
  ishlatilmaydi — har doim matn sifatida render qilinadi.
- Content-Security-Policy header: `default-src 'self'; script-src 'self'; object-src 'none'`
  (Next.js `next.config.ts` headers orqali).

## 15.5 CSRF

- Dashboard (cookie-based JWT sessiya) — `SameSite=Strict` cookie + double-submit CSRF
  token barcha mutatsion (`POST/PATCH/DELETE`) so'rovlarda.
- API-kalit bilan kiruvchi so'rovlar (tashqi dasturchilar) CSRF xavfiga duch kelmaydi —
  cookie ishlatilmaydi, shuning uchun bu himoya faqat dashboard sirtiga tegishli.

## 15.6 SQL Injection

- Prisma ORM — barcha so'rovlar parametrlangan; xom SQL (`$queryRawUnsafe`) ishlatilmaydi.
  Agar `$queryRaw` zarur bo'lsa — faqat tagged template (parametrlangan) shaklda.

## 15.7 Crawler cheklovlari

§10.2 (politeness) bilan bir qatorda:

- Scan job’lar uchun global concurrency limit (worker pool orqali) — bitta foydalanuvchi
  butun infratuzilmani band qilib qo'ymasligi uchun.
- `robots.txt` `Disallow: /` bo'lgan domenlar butunlay rad etiladi, foydalanuvchiga aniq
  xabar bilan.

## 15.8 Autentifikatsiya va sirlar

- Parollar: **argon2id** hash (bcrypt emas — zamonaviy tavsiya).
- API kalitlar: yaratilganda bir marta ko'rsatiladi, keyin faqat hash saqlanadi (§7).
- JWT — qisqa umr (`accessToken` 15 daqiqa) + `refreshToken` (httpOnly cookie, 30 kun,
  rotatsiya bilan).
- Muhit o'zgaruvchilari — `.env` git’ga commit qilinmaydi, `env.validation.ts` orqali
  ilova ishga tushishda tekshiriladi (majburiy o'zgaruvchi yo'q bo'lsa — fail-fast).

## 15.9 Bog'liqliklar va CI xavfsizligi

- `pnpm audit` / GitHub Dependabot — avtomatik zaifliklarni kuzatish.
- `CodeQL` GitHub Actions ichida statik tahlil uchun.
- Barcha CI workflow’lar `permissions: read-all` default, faqat kerakli job’larga yozish
  huquqi beriladi (masalan npm publish job’i).

## 15.10 Ma'lumot maxfiyligi

- Foydalanuvchi matni default saqlanmaydi (§7) — faqat hash + qisqa preview, va faqat
  explicit rozilik bilan to'liq matn.
- Scan qilingan saytlar — faqat **ommaviy** (robots.txt ruxsat bergan) sahifalar
  tekshiriladi; login talab qiladigan sahifalarga kirishga urinilmaydi.
