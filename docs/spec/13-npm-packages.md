# 13. npm Package Design

Barcha paketlar `@imlogram/*` skopida, `tsup` bilan CJS+ESM+`.d.ts` sifatida build qilinadi,
Changesets orqali mustaqil versiyalanadi (§18).

## Paketlar jadvali

| Paket | Vazifa | Runtime bog'liqlik | Bundle maqsad |
|---|---|---|---|
| `@imlogram/core` | Konvertatsiya, aniqlash, statistika mantig'i | Yo'q (sof TS) | < 15KB gzip |
| `@imlogram/parser` | Segmentatsiya/tokenizatsiya (core’ning ichki qatlami, lekin mustaqil ham ishlatsa bo'ladi) | Yo'q | < 8KB gzip |
| `@imlogram/node` | Fayl I/O, stream-based konvertatsiya | Node.js `fs`/`stream` | — |
| `@imlogram/browser` | Web Worker wrapper, Clipboard API helper | DOM API | < 3KB gzip |
| `@imlogram/react` | `useConverter()` hook, `<ImlogramText>` komponenti | React 18+ (peer) | < 5KB gzip |
| `@imlogram/next` | Middleware/Route Handler helperlari | Next.js 14+ (peer) | — |
| `@imlogram/cli` | Terminal vositasi | commander, `@imlogram/node` | — |

## API sirtlari

### `@imlogram/core`

```ts
export function convertToNew(text: string, options?: ConversionOptions): ConversionResult;
export function convertToOld(text: string, options?: ConversionOptions): ConversionResult;
export function detect(text: string): DetectionResult;
export function getStatistics(text: string): LetterStatistics;

interface ConversionOptions {
  protectUrls?: boolean;        // default true
  protectCode?: boolean;         // default true
  protectHtml?: boolean;          // default true
  exceptionDictionary?: Record<string, "old_to_new_skip">; // foydalanuvchi kengaytmasi
}
```

### `@imlogram/react`

```tsx
import { useConverter, ImlogramText } from "@imlogram/react";

function Example() {
  const { convert, result, isPending } = useConverter({ direction: "old_to_new" });
  return <ImlogramText text={result?.text ?? ""} highlightChanges />;
}
```

- `useConverter` — katta matnlar uchun ichki Web Worker’ga (`@imlogram/browser`) o'tkazadi,
  UI thread bloklanmaydi.
- `<ImlogramText>` — `changes` massivi asosida o'zgargan qismlarni `<mark>` bilan
  belgilashi mumkin (Detector UI uchun qulay).

### `@imlogram/next`

```ts
// middleware.ts
import { imlogramMiddleware } from "@imlogram/next/middleware";
export const middleware = imlogramMiddleware({ autoConvertResponseHtml: false });

// app/api/convert/route.ts (Route Handler helper)
import { createConvertHandler } from "@imlogram/next/server";
export const POST = createConvertHandler();
```

### `@imlogram/cli`

```bash
imlogram convert input.txt --to=new -o output.txt
imlogram detect input.txt --json
cat input.txt | imlogram convert --to=old > output.txt   # stdin/stdout qo'llab-quvvatlanadi
```

### `@imlogram/node`

```ts
import { convertFileToNew } from "@imlogram/node";
await convertFileToNew("input.docx", "output.docx");   // stream-based, katta fayllar uchun
```

## Dizayn tamoyillari

- **`@imlogram/core` hech qanday runtime-specific API (DOM, `fs`, `process`) ishlatmaydi** —
  shu bois u Node, brauzer va Edge runtime’larning (Cloudflare Workers, Vercel Edge) barchasida
  bir xil ishlaydi (FR-PKG-01).
- Har bir framework-paket (`react`, `next`) faqat **ingichka moslashtiruvchi qatlam** —
  ular hech qachon konvertatsiya qoidasini o'zida takrorlamaydi, faqat `@imlogram/core`ni
  chaqiradi.
- **Tree-shakable**: named export’lar, side-effect-free (`"sideEffects": false` package.json’da).
- Semver: `@imlogram/core` dagi alifbo qoidalari o'zgarishi (masalan yangi istisno qo'shilishi)
  **minor** deb hisoblanadi (yangi imkoniyat), lekin mavjud konvertatsiya natijasini
  o'zgartiradigan tuzatish **major** deb belgilanadi — chunki bu iste'molchi kodida
  kutilmagan natija farqiga olib kelishi mumkin (§18).

## Nashr qilish

- `pnpm publish` — GitHub Actions `release.yml` orqali, Changesets `version` + `publish`
  komandalari bilan avtomatlashtiriladi (§17, §18).
- Har bir paketning `README.md`si npm sahifasida to'g'ridan-to'g'ri ko'rinadi (§19 shabloni).
