# imlogram.uz

[![CI](https://github.com/imlogram/imlogram/actions/workflows/ci.yml/badge.svg)](https://github.com/imlogram/imlogram/actions/workflows/ci.yml)
[![npm @imlogram/core](https://img.shields.io/npm/v/%40imlogram%2Fcore?label=%40imlogram%2Fcore)](https://www.npmjs.com/package/@imlogram/core)
[![npm @imlogram/parser](https://img.shields.io/npm/v/%40imlogram%2Fparser?label=%40imlogram%2Fparser)](https://www.npmjs.com/package/@imlogram/parser)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Telegram bot](https://img.shields.io/badge/Telegram-%40imlogrambot-26A5E4?logo=telegram&logoColor=white)](https://t.me/imlogrambot)

Özbekistonning eski (1995) va yangi (2019/2021) lotin alifbosi orasida matnlarni
işonçli konvertatsiya qiladigan, aniqlaydigan va özbek kirillçasiga ham
ögiradigan oçiq kodli platforma.

> Oʻ/O'/O\` → Ö · Gʻ/G'/G\` → Ğ · Sh → Ş · Ch → Ç — kod, URL va struktura buzilmasdan.

## Nima bu

Oddiy `replace()` skriptlardan farqli ölaroq, kod bloklari, URL, email, HTML kabi
struktura içidagi matnga tegmaydi va `sh`/`ch` kabi digraflarning haqiqiy digraf yoki
mustaqil undoşlar ekanini (masalan "Is'hoq" ismida) ajrata oladi. Şu bir xil mantiq
(`@imlogram/core`) veb-saytda, Telegram botda va manba kod fayllarini (`.tsx`) ögirişda
qayta işlatiladi — heç qayerda takrorlanmagan.

Kutubxonalarni qanday işlatiş haqida töliq qöllanma: **[imlogram.uz/hujjatlar](https://imlogram.uz/hujjatlar)**.

## Sinab köring

- **Veb**: konverter/detektor — [imlogram.uz](https://imlogram.uz) *(hozirça deploy qilinmagan, lokal işga tuşiriş quyida)*
- **Telegram bot**: [@imlogrambot](https://t.me/imlogrambot)
- **Yangiliklar kanali**: [@imlogramuz](https://t.me/imlogramuz)

## Nima işlaydi (hozirgi holat)

| Qism | Holat |
|---|---|
| `@imlogram/parser` — himoyalangan zonalar (URL/kod/HTML) segmentatori | ✅ 22 test |
| `@imlogram/core` — eski↔yangi, kirillça↔lotin, manba-kod-xavfsiz konvertatsiya | ✅ 88 test |
| `apps/web` — Next.js sayt (Aylantirgiç, Aniqlagiç, SEO) | ✅ |
| `apps/bot` — Telegram bot (grammY, SQLite, majburiy a'zolik) | ✅ |
| `@imlogram/cli` — loyihangizdagi kodni skanerlab, körib çiqib, disk'ka yozadigan CLI | ✅ |
| REST API, ma'lumotlar bazasi | ⏳ Rejalaştirilgan |

## npm paketlar

```bash
pnpm add @imlogram/core       # konvertatsiya, aniqlaş, statistika
pnpm add @imlogram/parser     # segmentatsiya (core şu ustiga qurilgan)
npx @imlogram/cli migrate     # loyihangizdagi kod fayllarini ögiriş
```

- [`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core) — [README](packages/core/README.md)
- [`@imlogram/parser`](https://www.npmjs.com/package/@imlogram/parser) — [README](packages/parser/README.md)
- [`@imlogram/cli`](https://www.npmjs.com/package/@imlogram/cli) — [README](packages/cli/README.md)

## Tuzilma (monorepo)

```
apps/
  web/       Next.js — Aylantirgiç, Aniqlagiç, SEO
  bot/       Telegram bot (@imlogrambot)
packages/
  parser/    Segmentatsiya — himoyalangan zonalarni aniqlaydi
  core/      Konvertatsiya, aniqlash, statistika mantig'i
  cli/       Loyihadagi kod fayllarini skanerlab o'giruvchi CLI
```

## Işga tuşiriş

```bash
pnpm install
pnpm --filter @imlogram/parser build
pnpm --filter @imlogram/core build

cd apps/web && pnpm dev      # http://localhost:3000
# yoki
cd apps/bot && cp .env.example .env   # tokeningizni kiriting
pnpm dev
```

Testlarni işga tuşiriş: `pnpm turbo run build test typecheck`

Haqiqiy serverga (`imlogram.uz`, domen, SSL, bot) çiqariş uçun töliq qöllanma:
**[docs/deploy.md](docs/deploy.md)**.

## Texnologiyalar

Next.js · TypeScript · TurboRepo · pnpm · SQLite (bot) · grammY (bot) · Vitest ·
Tailwind CSS · GitHub Actions

## Hissa qoşiş

Imlogram oçiq kodli loyiha va boşqa dasturçilarning hissasini xuş kelibsiz deb kutamiz —
yangi istisno sözlari, bug fix, yangi til qoidalari yoki hatto yangi imkoniyatlar bölişi
mumkin.

Qayerdan boşlaş kerak:

- [`packages/core/src/rules/exceptions.ts`](packages/core/src/rules/exceptions.ts) dagi
  istisnolar luğatini kengaytiriş (manba bilan)
- [GitHub Issues](https://github.com/imlogram/imlogram/issues) bölimidan mavjud
  xatolarni körib çiqiş
- `@imlogram/cli` yoki `apps/bot` uçun yangi imkoniyat taklif qiliş

Pull sörov yuborişdan oldin `pnpm turbo run build test typecheck` buyruğini işga tuşirib,
hammasi yaşil ekanini tekşiring. Töliq qöllanma: **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Litsenziya

[MIT](LICENSE)
