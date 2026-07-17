# imlogram.uz

[![CI](https://github.com/imlogram/imlogram/actions/workflows/ci.yml/badge.svg)](https://github.com/imlogram/imlogram/actions/workflows/ci.yml)
[![npm @imlogram/core](https://img.shields.io/npm/v/%40imlogram%2Fcore?label=%40imlogram%2Fcore)](https://www.npmjs.com/package/@imlogram/core)
[![npm @imlogram/parser](https://img.shields.io/npm/v/%40imlogram%2Fparser?label=%40imlogram%2Fparser)](https://www.npmjs.com/package/@imlogram/parser)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Telegram bot](https://img.shields.io/badge/Telegram-%40imlogrambot-26A5E4?logo=telegram&logoColor=white)](https://t.me/imlogrambot)

O'zbekistonning eski (1995) va yangi (2019/2021) lotin alifbosi orasida matnlarni
ishonchli konvertatsiya qiladigan, aniqlaydigan va o'zbek kirillchasiga ham
o'giradigan ochiq kodli platforma.

> Oʻ/O'/O\` → Ö · Gʻ/G'/G\` → Ğ · Sh → Ş · Ch → Ç — kod, URL va struktura buzilmasdan.

## Nima bu

Oddiy `replace()` skriptlardan farqli o'laroq, kod bloklari, URL, email, HTML kabi
struktura ichidagi matnga tegmaydi va `sh`/`ch` kabi digraflarning haqiqiy digraf yoki
mustaqil undoshlar ekanini (masalan "Ishoq" ismida) ajrata oladi. Shu bir xil mantiq
(`@imlogram/core`) veb-saytda, Telegram botda va manba kod fayllarini (`.tsx`) o'girishda
qayta ishlatiladi — hech qayerda takrorlanmagan.

To'liq mahsulot va muhandislik spetsifikatsiyasi: **[docs/spec/README.md](docs/spec/README.md)**.

## Sinab ko'ring

- **Veb**: konverter/detektor — [imlogram.uz](https://imlogram.uz) *(hozircha deploy qilinmagan, lokal ishga tushirish quyida)*
- **Telegram bot**: [@imlogrambot](https://t.me/imlogrambot)
- **Yangiliklar kanali**: [@imlogramuz](https://t.me/imlogramuz)

## Nima ishlaydi (hozirgi holat)

| Qism | Holat |
|---|---|
| `@imlogram/parser` — himoyalangan zonalar (URL/kod/HTML) segmentatori | ✅ 22 test |
| `@imlogram/core` — eski↔yangi, kirillcha↔lotin, manba-kod-xavfsiz konvertatsiya | ✅ 88 test |
| `apps/web` — Next.js sayt (Converter, Detector, SEO) | ✅ |
| `apps/bot` — Telegram bot (grammY, SQLite, majburiy a'zolik) | ✅ |
| REST API, ma'lumotlar bazasi, boshqa npm paketlar | ⏳ Rejalashtirilgan — qarang [Roadmap](docs/spec/20-roadmap.md) |

## npm paketlar

```bash
pnpm add @imlogram/core       # konvertatsiya, aniqlash, statistika
pnpm add @imlogram/parser     # segmentatsiya (core shu ustiga qurilgan)
```

- [`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core) — [README](packages/core/README.md)
- [`@imlogram/parser`](https://www.npmjs.com/package/@imlogram/parser) — [README](packages/parser/README.md)

## Tuzilma (monorepo)

```
apps/
  web/       Next.js — Converter, Detector, SEO
  bot/       Telegram bot (@imlogrambot)
packages/
  parser/    Segmentatsiya — himoyalangan zonalarni aniqlaydi
  core/      Konvertatsiya, aniqlash, statistika mantig'i
docs/spec/   To'liq arxitektura va reja hujjatlari (20 bo'lim)
```

## Ishga tushirish

```bash
pnpm install
pnpm --filter @imlogram/parser build
pnpm --filter @imlogram/core build

cd apps/web && pnpm dev      # http://localhost:3000
# yoki
cd apps/bot && cp .env.example .env   # tokeningizni kiriting
pnpm dev
```

Testlarni ishga tushirish: `pnpm turbo run build test typecheck`

Haqiqiy serverga (`imlogram.uz`, domen, SSL, bot) chiqarish uchun to'liq qo'llanma:
**[docs/deploy.md](docs/deploy.md)**.

## Tech Stack

Next.js · TypeScript · TurboRepo · pnpm · SQLite (bot) · grammY (bot) · Vitest ·
Tailwind CSS · GitHub Actions

## Litsenziya

[MIT](LICENSE)
