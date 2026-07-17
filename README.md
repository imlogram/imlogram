# imlogram.uz

O'zbekistonning yangi lotin alifbosiga mos matnlarni yaratish, tekshirish va o'zgartirish
uchun ochiq kodli platforma.

> Oʻ/O'/O\` → Ö · Gʻ/G'/G\` → Ğ · Sh → Ş · Ch → Ç — kod, URL va struktura buzilmasdan.

## Nima bu

Imlogram eski (1995) va yangi (2019/2021) o'zbek lotin alifbosi orasidagi matnlarni
ishonchli tarzda konvertatsiya qiladi, aniqlaydi va butun saytlar bo'yicha skanerlaydi.
Oddiy `replace()` skriptlardan farqli o'laroq, kod bloklari, URL, email, JSON/HTML/CSS/YAML
kabi struktura ichidagi matnga tegmaydi va `sh`/`ch` kabi digraflarning haqiqiy digraf yoki
mustaqil undoshlar ekanini (masalan "Ishoq" ismida) ajrata oladi.

To'liq mahsulot va muhandislik spetsifikatsiyasi: **[docs/spec/README.md](docs/spec/README.md)**.

## Tuzilma (monorepo)

```
apps/        web (Next.js) · api (NestJS) · workers · docs · status
packages/    core · parser · node · browser · react · next · cli · ui · database
docs/spec/   To'liq arxitektura va reja hujjatlari (20 bo'lim)
```

Batafsil: [Monorepo Structure](docs/spec/05-monorepo-structure.md),
[Folder Structure](docs/spec/06-folder-structure.md).

## Tech Stack

Next.js · **NestJS** · TypeScript · TurboRepo · pnpm · PostgreSQL · Prisma · Redis ·
BullMQ · Docker · GitHub Actions · Vitest · Playwright

## Holat

Loyiha dizayn/spetsifikatsiya bosqichida — kod hali yozilmagan. Amalga oshirish tartibi
uchun qarang: [Roadmap](docs/spec/20-roadmap.md) (MVP → v1.0 → v1.5 → v2.0).

## Litsenziya

MIT (rasman qo'shiladi).
