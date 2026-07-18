# imlogram.uz

[![CI](https://github.com/imlogram/imlogram/actions/workflows/ci.yml/badge.svg)](https://github.com/imlogram/imlogram/actions/workflows/ci.yml)
[![npm @imlogram/core](https://img.shields.io/npm/v/%40imlogram%2Fcore?label=%40imlogram%2Fcore)](https://www.npmjs.com/package/@imlogram/core)
[![npm @imlogram/parser](https://img.shields.io/npm/v/%40imlogram%2Fparser?label=%40imlogram%2Fparser)](https://www.npmjs.com/package/@imlogram/parser)
[![npm @imlogram/cli](https://img.shields.io/npm/v/%40imlogram%2Fcli?label=%40imlogram%2Fcli)](https://www.npmjs.com/package/@imlogram/cli)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Telegram bot](https://img.shields.io/badge/Telegram-%40imlogrambot-26A5E4?logo=telegram&logoColor=white)](https://t.me/imlogrambot)

Özbekistonning eski (1995) va yangi 2026 alifbosi orasida matnlarni
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

- **Veb**: konverter/detektor — [imlogram.uz](https://imlogram.uz)
- **Telegram bot**: [@imlogrambot](https://t.me/imlogrambot)
- **Yangiliklar kanali**: [@imlogramuz](https://t.me/imlogramuz)

## npm paketlar

```bash
pnpm add @imlogram/core       # konvertatsiya, aniqlaş, statistika
pnpm add @imlogram/parser     # segmentatsiya (core şu ustiga qurilgan)
npx @imlogram/cli migrate     # loyihangizdagi kod fayllarini ögiriş
```

- [`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core) — [README](packages/core/README.md)
- [`@imlogram/parser`](https://www.npmjs.com/package/@imlogram/parser) — [README](packages/parser/README.md)
- [`@imlogram/cli`](https://www.npmjs.com/package/@imlogram/cli) — [README](packages/cli/README.md)

## Hissa qoşiş

Imlogram oçiq kodli loyiha — boşqa dasturçilarning hissasini xuş kelibsiz deb kutamiz.
Lokal işga tuşiriş, monorepo tuzilmasi va PR yuboriş qoidalari:
**[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Litsenziya

[MIT](LICENSE)
