# 19. Documentation Plan

## `docs.imlogram.uz` — tuzilma

Next.js + Nextra (yoki Fumadocs) asosida, MDX qo'llab-quvvatlanadi:

```
/docs                      Kirish, mahsulot haqida
/docs/getting-started        O'rnatish, birinchi konvertatsiya
/docs/concepts/alphabet-map    §8.1 jadvali, misollar
/docs/concepts/protected-zones  Himoyalangan zonalar tushuntirilishi
/docs/packages/core            @imlogram/core
/docs/packages/react             @imlogram/react
/docs/packages/next                @imlogram/next
/docs/packages/cli                  @imlogram/cli
/docs/api                              REST API (Swagger UI o'rnatilgan)
/docs/api/errors                        RFC 7807 xato kodlari ro'yxati
/docs/telegram-bot                        Bot komandalar, inline mode
/docs/scanner                              Scanner ishlatish qo'llanmasi
/docs/migration/v1-to-v2                    Har major uchun alohida sahifa
/docs/faq
/docs/contributing                            CONTRIBUTING.md’ga ko'chirilgan/ko'zgu
```

## Har bir npm paket README shabloni

```markdown
# @imlogram/<name>

Qisqa tavsif (1-2 gap).

## O'rnatish
\`\`\`bash
pnpm add @imlogram/<name>
\`\`\`

## Tezkor boshlash
(minimal ishlaydigan misol)

## API Reference
(asosiy funksiyalar/tiplar, docs.imlogram.uz’ga link)

## Misollar
(2-3 real holat, jumladan himoyalangan zonalar bilan)

## Migration Guide
(agar oldingi majordan farq bo'lsa)

## Litsenziya
MIT
```

## Repo darajasidagi hujjatlar

| Fayl | Mazmuni |
|---|---|
| `README.md` (root) | Loyiha tanishtiruvi, monorepo xaritasi, tezkor start |
| `CONTRIBUTING.md` | Dev muhitni sozlash, PR jarayoni, commit konvensiyasi, istisnolar lug'atiga qo'shish jarayoni (§8.4) |
| `CODE_OF_CONDUCT.md` | Contributor Covenant asosida |
| `SECURITY.md` | Zaiflik haqida xabar berish jarayoni (email/GitHub Security Advisory) |
| `docs/spec/*` | Ushbu spetsifikatsiya (arxitektura qarorlari manbai) |
| Har `packages/*/CHANGELOG.md` | Changesets tomonidan avtomatik generatsiya qilinadi |

## FAQ (boshlang'ich ro'yxat)

- "Nega mening 'Shukur' ismim o'zgarmadi?" — istisnolar lug'ati va konservativ strategiya
  haqida tushuntirish.
- "API bepulmi?" — tarif rejalari (v1.5+).
- "O'z saytimni skanerlashga ruxsat kerakmi?" — yo'q, ammo robots.txt hurmat qilinadi.
- "Kirill matnni ham konvertatsiya qilasizmi?" — hozircha yo'q, roadmap’da yo'q (§1 non-goals).

## Contribution Guide — asosiy nuqtalar

1. Dev muhit: `pnpm install`, `pnpm dev` (Turbo barcha app’larni parallel ishga tushiradi).
2. Yangi istisno so'z qo'shish — `packages/core/src/rules/exceptions.ts` + izohli manba +
   fixture test (§8.4, §16).
3. Yangi himoyalangan zona turi qo'shish — `packages/parser/src/protectors/` da yangi
   protector + kamida 10 ta fixture test.
4. Commit format: Conventional Commits (`feat:`, `fix:`, `docs:`, ...), commitlint CI’da
   tekshiriladi.
5. Har bir xatti-harakatni o'zgartiruvchi PR — Changeset fayli bilan (§18).

## Hujjatlar yangilanishini avtomatlashtirish

- OpenAPI spec — NestJS build vaqtida avtomatik generatsiya qilinib `docs.imlogram.uz`ga
  deploy vaqtida sinxronlanadi (qo'lda yozilmaydi).
- `@imlogram/core` tipdan JSDoc → API Reference sahifalari `typedoc` orqali avtomatik
  generatsiya qilinadi va MDX’ga singdiriladi.
