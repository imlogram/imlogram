# @imlogram/parser

[![npm](https://img.shields.io/npm/v/%40imlogram%2Fparser)](https://www.npmjs.com/package/@imlogram/parser)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/imlogram/imlogram/blob/main/LICENSE)

Matnni **himoyalangan zonalar** (URL, email, kod bloklari, HTML teglari, front-matter) va
oddiy matnga ajratadigan segmentatsiya dvigateli. [`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core)
shu paket ustiga qurilgan — u qaysi qismlarni o'zgartirish mumkinligini, qaysilarini
o'zgartirib bo'lmasligini shu yerdan biladi.

Odatda bu paketni **to'g'ridan-to'g'ri emas, `@imlogram/core` orqali** ishlatasiz. Faqat
o'zingizning maxsus matn-qayta-ishlash vositangizni qurmoqchi bo'lsangiz (masalan, o'zbek
matnidan boshqa narsa qilmoqchi bo'lsangiz, lekin baribir kod/URL xavfsizligi kerak bo'lsa),
buni alohida ishlatishingiz mumkin.

## O'rnatish

```bash
pnpm add @imlogram/parser
# yoki: npm install @imlogram/parser
```

## Tezkor boshlash

```ts
import { segment } from "@imlogram/parser";

const segments = segment("Sayt: https://example.com/Shop haqida gapiraylik.");

for (const seg of segments) {
  console.log(seg.kind, JSON.stringify(seg.raw));
}
// text  "Sayt: "
// url   "https://example.com/Shop"
// text  " haqida gapiraylik."
```

Manba kod fayllari (`.ts`/`.tsx`) uchun alohida rejim bor — bunda standart teskari:
hamma narsa **kod** deb hisoblanadi, faqat tabiiy-tilga o'xshagan string literal va JSX
matn tugunlari "matn" deb belgilanadi:

```ts
import { segmentSourceCode } from "@imlogram/parser";

const segments = segmentSourceCode(`
  const label = "Kirish matni"; // matn — konvertatsiya qilinadi
  const className = "rounded-full px-4"; // kod-shaklidagi satr — himoyalangan
`);
```

## API

### `segment(text: string): Segment[]`

Matnni `Segment[]` massiviga ajratadi. Har bir segment butun kirish matnini to'liq
qoplaydi (bo'shliq yoki ustma-ustlik yo'q) — `segments.map(s => s.raw).join("")` har doim
asl matnga teng.

```ts
interface Segment {
  kind: "text" | "url" | "email" | "code-block" | "inline-code"
      | "html-tag" | "html-entity" | "front-matter";
  raw: string;
  start: number;
  end: number;
}
```

### `segmentSourceCode(source: string): Segment[]`

Xuddi shunday, lekin manba kod uchun mo'ljallangan — teskari standart bilan (yuqorida
tushuntirilgan). Faqat `"text"` (konvertatsiya qilinadigan) va `"code-block"` (himoyalangan)
turlarini qaytaradi.

## Nima himoyalanadi

| Zona turi | Misol |
|---|---|
| URL | `https://example.com/Shop` |
| Email | `shukur@example.uz` |
| Kod bloki (fenced) | `` ```js\nconst x = 1;\n``` `` |
| Inline kod | `` `ShoppingCart` `` |
| HTML teg + atributlar | `<div className="rounded-full">` |
| Front-matter | Fayl boshidagi `---\n...\n---` bloki |

## Bog'liq paketlar

- [`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core) — bu paket ustiga
  qurilgan haqiqiy konvertatsiya, aniqlash va statistika mantig'i.

## Havolalar

- Manba kod: [github.com/imlogram/imlogram](https://github.com/imlogram/imlogram)
- To'liq spetsifikatsiya: [docs/spec](https://github.com/imlogram/imlogram/tree/main/docs/spec)
- Muammo haqida xabar berish: [GitHub Issues](https://github.com/imlogram/imlogram/issues)

## Litsenziya

MIT
