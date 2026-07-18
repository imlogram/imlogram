# Hissa qoşiş qöllanmasi

Imlogram oçiq kodli loyiha va boşqa dasturçilarning hissasini xuş kelibsiz deb kutamiz.

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

Haqiqiy serverga (`imlogram.uz`, domen, SSL, bot) çiqariş uçun töliq qöllanma:
**[docs/deploy.md](docs/deploy.md)**.

## Texnologiyalar

Next.js · TypeScript · TurboRepo · pnpm · SQLite (bot) · grammY (bot) · Vitest ·
Tailwind CSS · GitHub Actions

## Pull sörov yuborişdan oldin

`pnpm turbo run build test typecheck` buyruği xatosiz ötişi kerak.

Yangi özbekça matn qöşsangiz, uni `convertToNew()` orqali tekşirib, imlo xato
qilmaganingizga işonç hosil qiling — loyihaning özi öz vositasini sinovdan ötkazadi,
har bir yangi UI matni şu tarzda tekşiriladi.

## Istisnolar luğatiga söz qöşiş

[`packages/core/src/rules/exceptions.ts`](packages/core/src/rules/exceptions.ts) kiçik
va isbotlangan holda saqlanadi. Yangi söz qöşmoqçi bölsangiz, PR tavsifida manba
(luğat, adabiyot misoli yoki lingvistik izoh) keltiring — asossiz qöşilgan söz haqiqiy
matnlarni notöğri konvertatsiya qilişi mumkin.

## Commit xabarlari

Aniq va qisqa yozing — nima özgarganini emas, nega özgarganini tuşuntiring.

## Savol bölsa

[GitHub Issues](https://github.com/imlogram/imlogram/issues) orqali yozing yoki
[@SaidqodirxonUz](https://t.me/SaidqodirxonUz) bilan boğlaning.
