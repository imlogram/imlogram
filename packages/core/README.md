# @imlogram/core

[![npm](https://img.shields.io/npm/v/%40imlogram%2Fcore)](https://www.npmjs.com/package/@imlogram/core)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/imlogram/imlogram/blob/main/LICENSE)

Özbek tilidagi matnlarni **eski va yangi lotin alifbosi** hamda **kirillça** orasida
işonçli tarzda konvertatsiya qiladigan, aniqlaydigan va tahlil qiladigan kutubxona. Kod
bloklari, URL, email va HTML struktura içidagi matnga heç qaçon tegmaydi —
[`@imlogram/parser`](https://www.npmjs.com/package/@imlogram/parser) şu himoyani ta'minlaydi.

```
Oʻ / O' / O` → Ö     Gʻ / G' / G` → Ğ     Sh → Ş     Ch → Ç
```

## Örnatiş

```bash
pnpm add @imlogram/core
# yoki: npm install @imlogram/core
```

Node.js, brauzer va Edge runtime'larning (Cloudflare Workers, Vercel Edge) barçasida bir
xil işlaydi — heç qanday runtime-specific boğliqlik yöq.

## Tezkor boşlaş

```ts
import { convertToNew, convertToOld, detect, getStatistics } from "@imlogram/core";

convertToNew("Bu shahar juda chiroyli va go'zal.").text;
// "Bu şahar juda çiroyli va gözal."

convertToOld("Bu şahar juda çiroyli va gözal.").text;
// "Bu shahar juda chiroyli va go'zal."

detect("Bu shahar juda gözal.");
// { classification: "mixed", confidence: 0.5, segments: [...] }
```

Kod bloklari va URL heç qaçon özgarmaydi:

```ts
convertToNew("Ko'ring: https://example.com/Shop va `ShoppingCart` klassi.").text;
// "Köring: https://example.com/Shop va `ShoppingCart` klassi."
//          ^ o'zgarmadi                  ^ o'zgarmadi
```

## API

### `convertToNew(text, options?) / convertToOld(text, options?)`

Eski ↔ yangi lotin alifbosi orasida konvertatsiya. `options`:

```ts
interface ConversionOptions {
  protectUrls?: boolean;   // standart: true
  protectCode?: boolean;   // standart: true
  protectHtml?: boolean;   // standart: true
}
```

Natija:

```ts
interface ConversionResult {
  text: string;
  direction: "old_to_new" | "new_to_old" | "cyrillic_to_latin" | "latin_to_cyrillic";
  changes: Change[];   // har bir o'zgarish: { start, end, from, to, reason }
  stats: { charCount, wordCount, changedCount, readingTimeSec };
}
```

> **Muhim**: yangi→eski yönaliş 100% deterministik (bitta harflik jadval). Eski→yangi
> yönaliş esa `sh`/`ch` digraf yoki ikkita mustaqil undoş ekanini aniqlaşi kerak
> (masalan "Is'hoq" ismida) — buning uçun kiçik, kengaytiriladigan istisnolar luğati
> işlatiladi. Batafsil: [istisnolar luğati manbasi](https://github.com/imlogram/imlogram/blob/main/packages/core/src/rules/exceptions.ts).

### `convertCyrillicToLatin(text, options?) / convertLatinToCyrillic(text, options?)`

Özbek kirillçasi ↔ yangi lotin alifbosi. Lotin tomoni ham eski, ham yangi skriptni
qabul qiladi (`shahar` va `şahar` ikkalasi ham töğri işlaydi).

```ts
convertCyrillicToLatin("Бу шаҳар гўзал.").text;   // "Bu şahar gözal."
convertLatinToCyrillic("Bu shahar go'zal.").text;   // "Бу шаҳар гўзал."
```

### `detect(text): DetectionResult`

Matn eski, yangi yoki aralaş yozuvda ekanini aniqlaydi, gap darajasida:

```ts
interface DetectionResult {
  classification: "old" | "new" | "mixed";
  confidence: number;
  segments: { start: number; end: number; classification: "old" | "new" }[];
}
```

### `getStatistics(text): LetterStatistics`

```ts
getStatistics("Shahar chiroyli, bog'da o'ynayapmiz.");
// { letterCounts: { sh: 1, ch: 1, "gʻ": 1, "oʻ": 1 }, totalSpecialChars: 4 }
```

### `convertCodeToNew(sourceCode) / convertCodeToOld(sourceCode)`

`.ts`/`.tsx` fayllar içidagi UI matnini konvertatsiya qiladi — özgaruvçi nomlari,
import yöllari, JSX teglari va Tailwind klasslariga tegmasdan:

```ts
convertCodeToNew(`
  const [showChanges, setShowChanges] = useState(true);
  return <label placeholder="Matnni shu yerga yozing...">Kirish matni</label>;
`).text;
// showChanges — o'zgarmadi (identifikator)
// "Matnni shu yerga yozing..." → "Matnni şu yerga yozing..." (placeholder — matn)
// "Kirish matni" → "Kiriş matni" (JSX matn tuguni)
```

## Nega ikki yönaliş har xil murakkablikda

Yangi → eski — sof jadval, heç qanday noaniqlik yöq. Eski → yangi — `sh`/`ch` digraf yoki
ikkita mustaqil harf ekanini aniqlaşi kerak. Bu loyihaning markaziy texnik muammosi;
töliq tuşuntiriş: [imlogram.uz/hujjatlar](https://imlogram.uz/hujjatlar).

## Boğliq paketlar

- [`@imlogram/parser`](https://www.npmjs.com/package/@imlogram/parser) — segmentatsiya
  dvigateli (bu paket şu ustiga qurilgan)

## Havolalar

- Veb versiya: [imlogram.uz](https://imlogram.uz)
- Telegram bot: [@imlogrambot](https://t.me/imlogrambot)
- Manba kod: [github.com/imlogram/imlogram](https://github.com/imlogram/imlogram)
- Töliq hujjatlar: [imlogram.uz/hujjatlar](https://imlogram.uz/hujjatlar)
- Muammo haqida xabar beriş: [GitHub Issues](https://github.com/imlogram/imlogram/issues)

## Litsenziya

MIT
