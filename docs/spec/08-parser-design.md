# 8. Parser Design

Bu loyihaning texnik yuragi. Oddiy `String.replace()` yetarli emas, chunki: (1) apostrof
belgisining ko'p Unicode varianti bor, (2) digraf konvertatsiyasi kod/URL/struktura ichida
ishlamasligi kerak, (3) eski→yangi yo'nalish lingvistik jihatdan noaniq. Parser ikki bosqichli
arxitekturaga ega: **Segmentatsiya** (`@imlogram/parser`) → **Tokenizatsiya va almashtirish**
(`@imlogram/core`).

## 8.1 Alifbo xaritasi (kanonik)

| Eski | Yangi | Izoh |
|---|---|---|
| `Oʻ`, `O'`, `` O` ``, `Oʻ`, `O‘` | `Ö` | Katta harf |
| `oʻ`, `o'`, `` o` ``, `oʻ`, `o‘` | `ö` | Kichik harf |
| `Gʻ`, `G'`, `` G` ``, `Gʻ`, `G‘` | `Ğ` | Katta harf |
| `gʻ`, `g'`, `` g` ``, `gʻ`, `g‘` | `ğ` | Kichik harf |
| `Sh`, `SH` | `Ş` | So'z boshida/CamelCase |
| `sh` | `ş` | |
| `Ch`, `CH` | `Ç` | |
| `ch` | `ç` | |

### Apostrof variantlarini kanonlashtirish

`oʻ`/`gʻ` dagi apostrofga o'xshash belgi matnda kamida quyidagi Unicode kod nuqtalaridan
biri bilan kelishi mumkin — parser ularning barchasini bitta ichki kanonik belgiga
(`U+02BB MODIFIER LETTER TURNED COMMA`) normallashtiradi, so'ng xaritalaydi:

```ts
const APOSTROPHE_VARIANTS = [
  "ʻ", // ʻ MODIFIER LETTER TURNED COMMA (rasmiy)
  "ʼ", // ʼ MODIFIER LETTER APOSTROPHE
  "'", // ' APOSTROPHE (oddiy tugmadagi)
  "‘", // ' LEFT SINGLE QUOTATION MARK
  "’", // ' RIGHT SINGLE QUOTATION MARK
  "`", // ` GRAVE ACCENT
  "ˋ", // ˋ MODIFIER LETTER GRAVE ACCENT
  "´", // ´ ACUTE ACCENT (ba'zi klaviaturalarda)
] as const;
```

Muhim: bu variantlar **faqat** `o`/`O`/`g`/`G` dan keyin kelganda maxsus belgi sifatida
tushuniladi. Aks holda (masalan tirnoq sifatida ishlatilgan `'salom'`) tegilmaydi — bu
kontekstga bog'liq qoida, tokenizerda kod bilan amalga oshiriladi (§8.3).

## 8.2 Segmentatsiya — himoyalangan zonalar

Xom matn avval **Segmenter** orqali o'tadi, u matnni tag'langan segmentlar ketma-ketligiga
ajratadi:

```ts
type SegmentKind =
  | "text"           // konvertatsiya qilinadi
  | "url"
  | "email"
  | "code-block"      // ```...``` yoki 4-bo'shliq indent
  | "inline-code"      // `...`
  | "html-tag"          // <tag attr="...">
  | "html-entity"        // &nbsp; &amp; ...
  | "json-structure"      // JSON kalit/qiymat qatorlari ichidagi struktura belgilari
  | "front-matter";        // --- YAML ... ---

interface Segment {
  kind: SegmentKind;
  raw: string;
  start: number;
  end: number;
}
```

Har bir "protector" mustaqil, tartib bilan ishlaydi (birinchi mos kelgan g'olib bo'ladi):

1. **Front-matter protector** — matn boshidagi `---\n...\n---` blokini butunlay himoyalaydi.
2. **Code-block protector** — Markdown fenced (` ``` `) va inline (`` ` ``) kod bloklarini
   topadi va ichini `text` sifatida belgilamaydi.
3. **HTML/XML/JSX protector** — `<...>` teglarini, atribut nomlari va qiymatlarini
   (`class="ShoppingCart"`) himoyalaydi; **faqat text node**'lar (teglar orasidagi matn)
   `text` deb belgilanadi, agar u haqiqiy o'zbekcha ko'rinsa (§8.4 heuristika).
4. **URL/Email protector** — RFC 3986/5322 asosida yengillashtirilgan regex + state machine:
   `https?://`, `www.`, domenlar, va `local-part@domain` naqshlari.
5. **JSON-structure protector** — matn valid JSON bo'lsa, kalitlar va struktura belgilari
   (`{ } [ ] : ,`) himoyalanadi, faqat string **qiymatlar** ichidagi tabiiy matn
   konvertatsiya qilinadi (konfiguratsiya bilan o'chirish mumkin — ba'zi API javoblarida
   kalitlar ham o'zbekcha bo'lishi mumkin).
6. **Qolgan hamma narsa** → `text`.

Segmentlar bir-biriga ustma-ust tushmaydi va butun matnni to'liq qoplaydi (gap yo'q).
Faqat `text` kind’dagi segmentlar keyingi bosqichga — tokenizatsiyaga — yuboriladi.

## 8.3 Tokenizatsiya va eng-uzun-moslik qoidasi

`text` segment ichida konvertatsiya **eng uzun moslikni birinchi o'ynatish** (longest-match,
trie/Aho-Corasick uslubidagi) tamoyili bilan ishlaydi, chunki `sh` va `s`+`h` orasidagi
tanlov kontekstga bog'liq:

```
pozitsiya bo'yicha skanerlash →
  1. Apostrof-digraf tekshiruvi: joriy belgi o/O/g/G va keyingisi APOSTROPHE_VARIANTS dan
     biri bo'lsa → Ö/ö/Ğ/ğ ga xaritalanadi (uzunlik 2).
  2. sh/Sh/SH/ch/Ch/CH digraf tekshiruvi → istisno lug'atiga qarab (§8.4) Ş/ç yoki xom holda
     qoldiriladi.
  3. Aks holda: belgi o'zgarishsiz ko'chiriladi.
```

### Case-pattern saqlash

Har bir digraf o'zgartirilganda asl katta/kichik harf naqshi saqlanadi:

| Kirish | Naqsh | Chiqish |
|---|---|---|
| `Sharq` | Title (`Sh` + lower) | `Şarq` |
| `SHARQ` | UPPER | `ŞARQ` |
| `shahar` | lower | `şahar` |
| `oShKOZON` (aralash, kam uchraydigan) | mixed | harf-bo'yicha ko'chiriladi, heuristik yo'q — konservativ: faqat aniq naqshlar (Title/UPPER/lower) avtomatik boshqariladi, aks holda har bir harf o'z holicha xaritalanadi |

## 8.4 Istisnolar lug'ati — eski→yangi yo'nalishning "qiyin" tomoni

Eski yozuvda `sh` va `ch` digraf **doim** emas — ba'zan ikkita mustaqil undosh ketma-ket
keladi (odatda qo'shma so'z yoki ism chegarasida):

| So'z | To'g'ri bo'linish | To'g'ri natija | Noto'g'ri (naiv) natija |
|---|---|---|---|
| Ishoq (ism) | Is-hoq | `Ishoq` (o'zgarmaydi) | `Işoq` ❌ |
| Mashhur | Mash-hur (bu yerda `sh` haqiqiy digraf, `h` alohida) | `Maşhur` | — |
| Qadrshunos (kam uchraydigan qo'shma) | Qadr-shunos (`sh` digraf) | `Qadrşunos` | — |

Bunday holatlar tilshunoslik jihatidan cheklangan va **yopiq ro'yxat** orqali boshqariladi —
statistik/ML modelga hojat yo'q, chunki chegara holatlar soni kam va lug'at sifatida
hamjamiyat tomonidan kengaytiriladi:

```ts
// packages/core/src/rules/exceptions.ts
export const DIGRAPH_BOUNDARY_EXCEPTIONS: Record<string, "old_to_new_skip"> = {
  "ishoq": "old_to_new_skip",     // Is-hoq (ism)
  "ishonch": "old_to_new_skip",   // ⚠ diqqat: aslida "ishonch" o'zi "ish" + "onch" emas,
                                    // haqiqiy misol qoidasi hamjamiyat tilshunoslari bilan
                                    // tasdiqlanadi — bu yerda faqat mexanizm ko'rsatilgan
  // ... hamjamiyat PR orqali kengaytiradi, har biri lingvistik izoh bilan
};
```

Lug'at `CONTRIBUTING.md`da tasvirlangan jarayon orqali kengaytiriladi: yangi istisno PR’ga
manba (izohli lug'at, akademik havola yoki O'zbekiston Fanlar Akademiyasi Til va adabiyot
instituti nashri) bilan qo'shiladi — noto'g'ri bashorat qilingan sun'iy qoidalar emas.

**Muhim strategik qaror:** noaniq holatlarda parser **konservativ** ishlaydi — agar so'z
istisnolar lug'atida yo'q bo'lsa va imlo qoidasiga ko'ra standart bo'lsa, standart digraf
qoidasi qo'llaniladi (chunki 99%+ holatlarda `sh`/`ch` haqiqiy digraf). Faqat lug'atda aniq
qayd etilgan so'zlar uchun istisno qo'llaniladi. Yangi→eski yo'nalish bu muammoga umuman
duch kelmaydi (§9.3 — bijektiv, jadval asosida).

## 8.5 Performance dizayni

- Segmentatsiya — bitta chiziqli o'tish, regex’lar oldindan kompilyatsiya qilingan.
- Tokenizer — belgi-bo'yicha state machine (Aho-Corasick emas, chunki naqshlar soni kichik
  va sobit — oddiy `switch`/lookup jadval yetarli va tezroq).
- Katta matnlar uchun (`FR-CONV-10`) segmentatsiya va tokenizatsiya chunk’larga bo'linadi
  (segment chegaralarida), Web Worker/Node worker_threads’da ishlaydi.
