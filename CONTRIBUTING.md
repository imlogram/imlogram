# Hissa qoşiş qöllanmasi

Imlogram oçiq kodli loyiha va boşqa dasturçilarning hissasini xuş kelibsiz deb kutamiz.

## Işga tuşiriş

Lokal muhitni qanday sozlaş uçun asosiy [README](README.md)dagi "Işga tuşiriş" bölimiga
qarang.

## Pull sörov yuborişdan oldin

`pnpm turbo run build test typecheck` buyruği xatosiz ötişi kerak.

Yangi özbekça matn qöşsangiz, uni `convertToNew()` orqali tekşirib, imlo xato
qilmaganingizga işonç hosil qiling — loyihaning özi öz vositasini sinovdan ötkazadi,
har bir yangi UI matni şu tarzda tekşiriladi.

## Istisnolar luğatiga söz qöşiş

[`packages/core/src/rules/exceptions.ts`](packages/core/src/rules/exceptions.ts) kiçik
va isbotlangan holda saqlanadi. Yangi söz qöşmoqçi bölsangiz, PR tavsifida manba
(luğat, adabiyot misoli yoki lingvistik izoh) keltiring — asossiz qöşilgan söz haqiqiy
matnlarni notöğri konvertatsiya qilişi mumkin.

## Commit xabarlari

Aniq va qisqa yozing — nima özgarganini emas, nega özgarganini tuşuntiring.

## Savol bölsa

[GitHub Issues](https://github.com/imlogram/imlogram/issues) orqali yozing yoki
[@SaidqodirxonUz](https://t.me/SaidqodirxonUz) bilan boğlaning.
