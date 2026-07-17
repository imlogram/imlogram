# @imlogram/cli

[![npm](https://img.shields.io/npm/v/%40imlogram%2Fcli)](https://www.npmjs.com/package/@imlogram/cli)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/imlogram/imlogram/blob/main/LICENSE)

Skanerlaydi. Körsatadi. Siz tasdiqlaysiz. Şundan keyingina fayllarga yozadi.

Loyihangizdagi `.ts`/`.tsx`/`.js`/`.jsx` fayllarni topib, ularning içidagi tabiiy-tilga
öxşagan matnlarni ([`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core) orqali)
aniqlaydi — özgaruvçi nomlari, importlar, JSX teglari va Tailwind klasslariga tegmasdan.
Keyin brauzerda lokal bir sahifa oçadi: har bir topilgan matnni körasiz, kerakmaganlarini
bekor qilasiz, va faqat tasdiqlangan özgarişlar diskdagi fayllarga yoziladi.

## Foydalaniş

```bash
npx @imlogram/cli migrate .
```

```
Skanerlanmoqda: /path/to/loyiha
14 ta matn topildi (5 ta faylda).

Körib çiqiş uçun brauzerda oçing: http://localhost:4321
```

Brauzerda oçilgan sahifada har bir fayl böyiça topilgan matnlar röyxati, ularning
konvertatsiya qilingandan keyingi körinişi, va checkbox'lar bilan tanlaş imkoniyati
körsatiladi. "Tanlanganlarni qöllaş" tugmasi bosilgaç, faqat belgilangan özgarişlar
fayllarga yoziladi — qolganlari tegilmay qoladi.

## Parametrlar

```bash
npx @imlogram/cli migrate [papka] [--to=new|old] [--port=4321]
```

| Parametr | Standart | Tavsif |
|---|---|---|
| `papka` | `.` (joriy papka) | Qaysi papkani skanerlaş kerak |
| `--to` | `new` | `new` — eski→yangi, `old` — yangi→eski |
| `--port` | `4321` | Lokal serverning porti |

## Nega bu CLI kerak, sayt yetarli emasmi

`imlogram.uz`dagi Aylantirgiç bitta matn parçasini qabul qiladi. Bu CLI esa **butun
loyihani** — önlab fayllarni bir yöla — skanerlab, har bir özgarişni köz bilan
körib tasdiqlaş imkonini beradi, va natijani töğridan-töğri fayllaringizga yozadi.
Katta kod bazasini yangi alifboga ötkaziş uçun möljallangan.

## Xavfsizlik

CLI heç qanday tarmoqqa (internet) sörov yubormaydi — hammasi lokal maşinangizda,
lokal serverda işlaydi. Fayllarga yozişdan oldin har doim `git status`/`git diff` bilan
tekşirib çiqiş, yoki avval commit qilib oliş tavsiya etiladi (özgarişlarni qaytarib
bölmaydigan holatga tuşmaslik uçun).

## Havolalar

- Manba kod: [github.com/imlogram/imlogram](https://github.com/imlogram/imlogram)
- Töliq hujjatlar: [imlogram.uz/hujjatlar](https://imlogram.uz/hujjatlar)
- Muammo haqida xabar beriş: [GitHub Issues](https://github.com/imlogram/imlogram/issues)

## Litsenziya

MIT
