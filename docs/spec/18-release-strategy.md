# 18. Release Strategy

## Versiyalash — Changesets

- Har bir `packages/*` mustaqil semver’ga ega. PR muallifi `pnpm changeset` orqali qaysi
  paket(lar) va qanday daraja (`patch`/`minor`/`major`) o'zgarganini e'lon qiladi + qisqa
  tavsif yozadi — bu avtomatik `CHANGELOG.md` manbai bo'ladi.
- `apps/*` versiyalanmaydi (ular deploy qilinadi, publish qilinmaydi) — faqat `packages/*`
  Changesets doirasida.

## Semver siyosati (alifbo qoidalariga nisbatan alohida qat'iy qoida)

Oddiy kod o'zgarishidan farqli o'laroq, **konvertatsiya natijasini o'zgartiradigan har qanday
qoida o'zgarishi — hatto "tuzatish" bo'lsa ham — `major` hisoblanadi.** Sabab: iste'molchi
kod bazasi (masalan katta CMS) allaqachon eski natijaga moslashgan bo'lishi mumkin;
kutilmagan matn farqi production’da sezilmasdan tarqalishi mumkin.

| O'zgarish turi | Daraja |
|---|---|
| Yangi himoyalangan zona turi qo'shildi (masalan YAML) | `minor` |
| Yangi ixtiyoriy `ConversionOptions` maydon | `minor` |
| Istisnolar lug'atiga so'z qo'shildi/o'zgartirildi | `major` |
| Bug fix — API xato qaytargan holatga tuzatish (masalan xato tashlamasligi kerak bo'lgan joyda xato tashlagan) | `patch` |
| Xato tuzatish — natija matnini o'zgartiradi | `major` |
| Yangi paket (masalan `@imlogram/vue`) | `minor` (yangi paket `1.0.0`dan boshlanadi) |

## Kanallar (npm dist-tags)

- `latest` — barqaror, production-ready.
- `next` — kelayotgan major versiya, RC bosqichida (masalan yangi imlo qoidalari to'plami
  sinovdan o'tmoqda).
- `canary` — har bir `main`ga merge’dan keyin avtomatik publish (commit SHA bilan
  tag’langan), erta sinovchilar uchun.

## Alifbo qoidalari to'plamining versiyalanishi

Til qoidalari (§8.1 jadvali, istisnolar lug'ati) alohida versiyalangan ma'lumot sifatida
qaraladi (`packages/core/src/rules/*` — `RULESET_VERSION` konstantasi bilan belgilanadi).
Agar til instituti rasmiy ravishda qoidalarni kengaytirsa (masalan yangi istisno so'zlar
tasdiqlansa), bu `RULESET_VERSION` oshiriladi va `ConversionResult`ga qaysi ruleset versiyasi
ishlatilgani qo'shiladi — bu audit va reproducibility uchun muhim (masalan davlat idorasi
"qaysi qoida bilan konvertatsiya qilingan" deb so'rasa, javob berish mumkin).

## Release jarayoni (amaliy oqim)

1. Har PR — kerak bo'lsa `changeset` fayli bilan birga.
2. `main`ga merge → Changesets bot "Version Packages" PR’ni avtomatik yangilaydi
   (versiyalarni bump qiladi, CHANGELOG yozadi).
3. Maintainer bu PR’ni ko'rib chiqadi (breaking change’lar to'g'ri belgilanganini
   tasdiqlaydi) va merge qiladi.
4. Merge — `changesets.yml` avtomatik `pnpm changeset publish` ishga tushiradi → npm’ga
   chiqadi, git tag’lar (`@imlogram/core@2.1.0`) qo'yiladi, GitHub Release yaratiladi.

## Deprecation siyosati

- REST API eski versiya (`/v1`) yangi major (`/v2`) chiqqandan keyin kamida **12 oy**
  qo'llab-quvvatlanadi, `Sunset` HTTP header bilan ogohlantiriladi.
- npm paketlarda: major versiya chiqqanda oldingi major kamida **6 oy** critical security
  fix oladi (`N-1` support window).
- Har bir deprecation `docs.imlogram.uz`da Migration Guide bilan birga e'lon qilinadi (§19).

## LTS

v1.0 API barqarorlashgach, yiliga bittadan LTS-belgilangan major versiya (masalan davlat
integratsiyalari uchun) 18 oy qo'llab-quvvatlanadi — bu v2.0+ bosqichida rasmiylashtiriladi.
