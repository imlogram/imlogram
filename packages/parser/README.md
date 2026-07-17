# @imlogram/parser

[![npm](https://img.shields.io/npm/v/%40imlogram%2Fparser)](https://www.npmjs.com/package/@imlogram/parser)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/imlogram/imlogram/blob/main/LICENSE)

Matnni **himoyalangan zonalar** (URL, email, kod bloklari, HTML teglari, front-matter) va
oddiy matnga ajratadigan segmentatsiya dvigateli. [`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core)
şu paket ustiga qurilgan — u qaysi qismlarni özgartiriş mumkinligini, qaysilarini
özgartirib bölmasligini şu yerdan biladi.

Odatda bu paketni **töğridan-töğri emas, `@imlogram/core` orqali** işlatasiz. Faqat
özingizning maxsus matn-qayta-işlaş vositangizni qurmoqçi bölsangiz (masalan, özbek
matnidan boşqa narsa qilmoqçi bölsangiz, lekin baribir kod/URL xavfsizligi kerak bölsa),
buni alohida işlatişingiz mumkin.

## Örnatiş

```bash
pnpm add @imlogram/parser
# yoki: npm install @imlogram/parser
```

## Tezkor boşlaş

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

Manba kod fayllari (`.ts`/`.tsx`) uçun alohida rejim bor — bunda standart teskari:
hamma narsa **kod** deb hisoblanadi, faqat tabiiy-tilga öxşagan string literal va JSX
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

Matnni `Segment[]` massiviga ajratadi. Har bir segment butun kiriş matnini töliq
qoplaydi (böşliq yoki ustma-ustlik yöq) — `segments.map(s => s.raw).join("")` har doim
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

Xuddi şunday, lekin manba kod uçun möljallangan — teskari standart bilan (yuqorida
tuşuntirilgan). Faqat `"text"` (konvertatsiya qilinadigan) va `"code-block"` (himoyalangan)
turlarini qaytaradi.

## Nima himoyalanadi

| Zona turi | Misol |
|---|---|
| URL | `https://example.com/Shop` |
| Email | `shukur@example.uz` |
| Kod bloki (fenced) | `` ```js\nconst x = 1;\n``` `` |
| Inline kod | `` `ShoppingCart` `` |
| HTML teg + atributlar | `<div className="rounded-full">` |
| Front-matter | Fayl boşidagi `---\n...\n---` bloki |

## Boğliq paketlar

- [`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core) — bu paket ustiga
  qurilgan haqiqiy konvertatsiya, aniqlaş va statistika mantiği.

## Havolalar

- Manba kod: [github.com/imlogram/imlogram](https://github.com/imlogram/imlogram)
- Töliq hujjatlar: [imlogram.uz/hujjatlar](https://imlogram.uz/hujjatlar)
- Muammo haqida xabar beriş: [GitHub Issues](https://github.com/imlogram/imlogram/issues)

## Litsenziya

MIT
