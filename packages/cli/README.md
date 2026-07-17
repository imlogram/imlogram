# @imlogram/cli

[![npm](https://img.shields.io/npm/v/%40imlogram%2Fcli)](https://www.npmjs.com/package/@imlogram/cli)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/imlogram/imlogram/blob/main/LICENSE)

Skanerlaydi. Körsatadi. Siz tasdiqlaysiz. Şundan keyingina fayllarga yozadi.

Loyihangizdagi `.ts`/`.tsx`/`.js`/`.jsx` fayllarni topib, ularning içidagi tabiiy-tilga
o'xşagan matnlarni ([`@imlogram/core`](https://www.npmjs.com/package/@imlogram/core) orqali)
aniqlaydi — o'zgaruvçi nomlari, importlar, JSX teglari va Tailwind klasslariga tegmasdan.
Keyin brauzerda lokal bir sahifa oçadi: har bir topilgan matnni ko'rasiz, kerakmaganlarini
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

Brauzerda oçilgan sahifada har bir fayl bo'yiça topilgan matnlar ro'yxati, ularning
konvertatsiya qilingandan keyingi ko'rinişi, va checkbox'lar bilan tanlash imkoniyati
körsatiladi. "Tanlanganlarni qöllaş" tugmasi bosilgach, faqat belgilangan özgarişlar
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

`imlogram.uz`dagi Converter bitta matn parçasini qabul qiladi. Bu CLI esa **butun
loyihani** — o'nlab fayllarni bir yo'la — skanerlab, har bir özgarişni ko'z bilan
körib tasdiqlaş imkonini beradi, va natijani to'g'ridan-to'g'ri fayllaringizga yozadi.
Katta kod bazasini yangi alifboga o'tkaziş uçun mo'ljallangan.

## Xavfsizlik

CLI hech qanday tarmoqqa (internet) so'rov yubormaydi — hammasi lokal maşinangizda,
lokal serverda işlaydi. Fayllarga yozişdan oldin har doim `git status`/`git diff` bilan
tekşirib çiqiş, yoki avval commit qilib olish tavsiya etiladi (özgarişlarni qaytarib
bo'lmaydigan holatga tuşmaslik uçun).

## Havolalar

- Manba kod: [github.com/imlogram/imlogram](https://github.com/imlogram/imlogram)
- To'liq spetsifikatsiya: [docs/spec](https://github.com/imlogram/imlogram/tree/main/docs/spec)
- Muammo haqida xabar berish: [GitHub Issues](https://github.com/imlogram/imlogram/issues)

## Litsenziya

MIT
