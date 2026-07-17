# Imlogram.uz — Specification Index

Imlogram.uz — Oʻzbekistonning yangi lotin alifbosiga oid matnlarni professional darajada
konvertatsiya qilish, aniqlash va tekshirish uchun ochiq kodli platforma.

Bu papka loyihaning to'liq mahsulot va muhandislik spetsifikatsiyasini o'z ichiga oladi.
Kod yozishdan oldin arxitektura va qarorlar shu yerda muhokama qilinadi va qayd etiladi.

## Bo'limlar

| # | Hujjat | Mazmuni |
|---|--------|---------|
| 1 | [Product Vision](01-product-vision.md) | Missiya, muammo, foydalanuvchilar, muvaffaqiyat mezonlari |
| 2 | [Functional Requirements](02-functional-requirements.md) | Har bir modul bo'yicha FR va acceptance criteria |
| 3 | [Non-Functional Requirements](03-non-functional-requirements.md) | Performance, security, a11y, i18n, SLA |
| 4 | [System Architecture](04-system-architecture.md) | Komponentlar, ma'lumot oqimi, diagrammalar |
| 5 | [Monorepo Structure](05-monorepo-structure.md) | TurboRepo + pnpm workspace tuzilishi |
| 6 | [Folder Structure](06-folder-structure.md) | Har bir app/package ichki tuzilishi |
| 7 | [Database Design](07-database-design.md) | Prisma schema, ERD |
| 8 | [Parser Design](08-parser-design.md) | Segmentatsiya, himoyalangan zonalar, tokenizer |
| 9 | [Conversion Algorithm](09-conversion-algorithm.md) | Algoritm, murakkablik, reversibility |
| 10 | [Website Scanner Architecture](10-website-scanner.md) | Crawler, queue, export |
| 11 | [Telegram Bot Architecture](11-telegram-bot.md) | Komandalar, inline mode |
| 12 | [REST API Specification](12-rest-api.md) | Endpoint'lar, auth, error format |
| 13 | [npm Package Design](13-npm-packages.md) | 7 ta paket, API sirtlari |
| 14 | [UI/UX Structure](14-ui-ux.md) | Sahifalar, komponentlar, dizayn tizimi |
| 15 | [Security Strategy](15-security.md) | Rate limiting, SSRF, XSS, CSRF, auth |
| 16 | [Testing Strategy](16-testing.md) | Unit/integration/e2e/fuzz/benchmark |
| 17 | [CI/CD](17-ci-cd.md) | GitHub Actions workflow'lari |
| 18 | [Release Strategy](18-release-strategy.md) | Semver, changesets, kanallar |
| 19 | [Documentation Plan](19-documentation-plan.md) | docs.imlogram.uz, README shabloni |
| 20 | [Development Roadmap](20-roadmap.md) | MVP → v1.0 → v1.5 → v2.0 |

## Asosiy tamoyillar

1. **To'g'rilik > tezlik.** Alifbo konvertatsiyasi lingvistik jihatdan noaniq bo'lishi mumkin
   (bir-necha-ko'p moslik muammosi) — noto'g'ri konvertatsiya qilingan matn foydalanuvchi
   ishonchini yo'qotadi. Noaniq holatlarda konservativ yondashuv: o'zgartirmaslik xato qilib
   o'zgartirishdan yaxshiroq.
2. **Kod va tuzilma daxlsiz.** URL, email, kod bloklari, JSON/HTML/CSS/YAML kabi struktura
   ichidagi belgilar hech qachon o'zgartirilmaydi. Bu talab parser dizaynining markazida turadi.
3. **Bitta manba — ko'p platforma.** `@imlogram/core` — barcha qavatlar (web, API, bot, CLI,
   npm paketlar) foydalanadigan yagona, izomorfik konvertatsiya mexanizmi.
4. **Standart sifatida qurish.** API barqaror, versiyalangan va hujjatlashtirilgan bo'lishi
   kerak — chunki maqsad shaxsiy loyiha emas, milliy infratuzilma bo'lishi mumkin.
