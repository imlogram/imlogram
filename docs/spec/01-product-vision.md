# 1. Product Vision

## Missiya

O'zbekiston 1995 va 2019/2021-yillardagi lotin alifbosi islohotlari orasida qolgan millionlab
matnga ega: davlat portallari, yangilik saytlari, ta'lim materiallari, ijtimoiy tarmoq postlari.
Rasmiy yangi alifbo (Ö, ö, Ğ, ğ, Ş, ş, Ç, ç) qabul qilingan bo'lsa-da, amaliyotda eski yozuv
(Oʻ, Gʻ, Sh, Ch) hali ham hukmron. Imlogram.uz — bu ikki yozuv orasidagi ko'prik: matnlarni
ishonchli, kod-xavfsiz va ommaviy tarzda bir yozuvdan ikkinchisiga o'tkazadigan infratuzilma.

## Muammo bayoni

- Oddiy `find & replace` skriptlar kod, URL, JSON kabi struktura ichidagi "Sh"/"Ch" kabi
  harflarni buzib qo'yadi (masalan `ShoppingCart` → `ŞoppingCart` — noto'g'ri).
- Apostrof belgisining kamida 6-7 xil Unicode varianti (`ʻ ʼ ' ' ' \``) ishlatiladi va
  ko'pchilik konverter shularning barchasini tushunmaydi.
- Konvertatsiya yo'nalishlaridan biri (eski → yangi) lingvistik jihatdan **noaniq**: masalan
  "Ishoq" ismidagi "sh" digraf emas, balki "s" va "h" alohida tovushlar — buni faqat lug'at
  asosidagi istisnolar bilan hal qilish mumkin. Hech bir mavjud vosita buni hisobga olmaydi.
- Tashkilotlar (davlat idoralari, media, ta'lim) o'z saytlarida qancha "eski" matn qolganini
  bilishning umuman iloji yo'q — bu esa islohotni monitoring qilishni imkonsiz qiladi.

## Kimlar uchun

| Segment | Ehtiyoj |
|---|---|
| Davlat va rasmiy institutlar | Saytlarini yangi standartga muvofiqligini tekshirish va hisobot olish |
| Media va noshirlar | Katta hajmdagi matnni tez va xavfsiz konvertatsiya qilish |
| Dasturchilar | O'z mahsulotlariga (CMS, chat-bot, forma) konvertatsiyani SDK orqali qo'shish |
| Ta'lim muassasalari | O'quvchilarga ikki yozuv farqini o'rgatish, matn tekshirish |
| Oddiy foydalanuvchilar | Telegram orqali tezkor, do'stona konvertatsiya |

## Nima uchun endi va nima uchun biz

Til islohoti sekin, tarqoq tarzda amalga oshmoqda — markazlashgan, ishonchli vosita yo'qligi
sabab. Imlogram ochiq kodli, versiyalangan qoidalar to'plami va ommaviy API bilan **de-facto
standart** bo'lishga intiladi: xuddi `intl` yoki `ICU` kabi, lekin o'zbek lotin alifbosi uchun.

## Muvaffaqiyat mezonlari (12 oy)

- Parser 1000+ test holatida (jumladan real veb-saytlardan olingan corpus) 99.5%+ aniqlik.
- `@imlogram/core` npm’da haftasiga 1000+ yuklab olish.
- API kamida 50 ta tashqi loyihada ishlatilishi (jamoat kalitlari orqali kuzatiladi).
- Kamida 20 ta davlat/media sayti skaner qilingan va hisobot berilgan.
- GitHub’da 500+ yulduz, 10+ tashqi hissa qo'shuvchi (contributor).

## Non-goals (v2.0 gacha doirasidan tashqari)

- Kirill ↔ Lotin transliteratsiyasi (alohida, murakkab lingvistik muammo — kelajakda alohida
  modul sifatida ko'rib chiqiladi, lekin MVP/v1 qamrovida emas).
- Ovozli/nutqni matnga aylantirish integratsiyasi.
- To'liq CMS yoki tarjima platformasi bo'lish — Imlogram bitta narsani juda yaxshi qiladi:
  alifbo konvertatsiyasi va aniqlash.
