# Misollar (examples)

Bu papkadagi loyihalar **monorepo qismi emas** — ular ataylab `pnpm-workspace.yaml`
tashqarisida joylashgan, shuning uchun `@imlogram/core`ni ichki `workspace:*` havolasi
orqali emas, **haqiqiy npm registry'dan** o'rnatadi. Maqsad: monorepo'dagi 110+ testimiz
kod manbasini tekshiradi, lekin **nashr qilingan paket** haqiqatan tashqi loyihada,
haqiqiy bundler bilan ishlashini faqat shunday tekshirish mumkin.

## [`html/`](html/) — build vositasisiz

`index.html`ni brauzerda oching (yoki `python3 -m http.server` bilan serving qiling) —
`@imlogram/core` [esm.sh](https://esm.sh) orqali to'g'ridan-to'g'ri CDN'dan yuklanadi,
hech qanday `npm install` yoki bundler kerak emas.

```bash
cd examples/html
python3 -m http.server 8000
# brauzerda: http://localhost:8000
```

## [`react/`](react/) — Vite + React + TypeScript

```bash
cd examples/react
npm install
npm run dev
```

`npm install` `@imlogram/core@^0.1.1`ni `registry.npmjs.org`dan o'rnatishini
`node_modules/@imlogram/core/package.json`dan tekshirish mumkin.

## Nega bu muhim

Ichki monorepo testlari (`pnpm turbo run test`) va tashqi misollar ikki xil narsani
tekshiradi:

| | Nimani tekshiradi |
|---|---|
| `packages/core/test/*.test.ts` (110+ test) | Konvertatsiya mantig'ining **to'g'riligi** |
| `examples/*` | Nashr qilingan paketning **haqiqatan ishlatilishi mumkinligi** — to'g'ri `exports`, `main`/`module`/`types` maydonlari, ESM/CJS moslik, bog'liqliklar to'g'ri yechilishi |

Ikkalasi ham kerak — birinchisi mantiqiy xatolarni, ikkinchisi paketlash (packaging)
xatolarini ushlaydi.
