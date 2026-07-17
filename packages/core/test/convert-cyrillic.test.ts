import { describe, expect, it } from "vitest";
import {
  convertCyrillicToLatin,
  convertLatinToCyrillic,
} from "../src/convert-cyrillic.js";

describe("convertCyrillicToLatin", () => {
  it("converts a simple deterministic word", () => {
    expect(convertCyrillicToLatin("мактаб").text).toBe("maktab");
  });

  it("converts ш -> ş and ч -> ç", () => {
    expect(convertCyrillicToLatin("шаҳар").text).toBe("şahar");
    expect(convertCyrillicToLatin("чиройли").text).toBe("çiroyli");
  });

  it("converts ў -> ö, қ -> q, ғ -> ğ, ҳ -> h", () => {
    expect(convertCyrillicToLatin("бўз").text).toBe("böz");
    expect(convertCyrillicToLatin("қалам").text).toBe("qalam");
    expect(convertCyrillicToLatin("боғ").text).toBe("boğ");
    expect(convertCyrillicToLatin("ҳаво").text).toBe("havo");
  });

  it("converts ц -> ts", () => {
    expect(convertCyrillicToLatin("цех").text).toBe("tsex");
  });

  it("converts ъ (tutuq belgisi) to the modifier apostrophe", () => {
    expect(convertCyrillicToLatin("санъат").text).toBe("sanʼat");
  });

  it("preserves case: uppercase single letters and title case", () => {
    expect(convertCyrillicToLatin("МАКТАБ").text).toBe("MAKTAB");
    expect(convertCyrillicToLatin("Мактаб").text).toBe("Maktab");
    expect(convertCyrillicToLatin("Шаҳар").text).toBe("Şahar");
  });

  it("renders е as 'ye' word-initially and after a vowel, 'e' after a consonant", () => {
    expect(convertCyrillicToLatin("енгил").text).toBe("yengil"); // word-initial
    expect(convertCyrillicToLatin("мен").text).toBe("men"); // after consonant
    expect(convertCyrillicToLatin("Елена").text).toBe("Yelena"); // title case, word-initial
  });

  it("renders ё/ю/я with the y-prefix rule and correct case", () => {
    expect(convertCyrillicToLatin("Юлдуз").text).toBe("Yulduz"); // real Uzbek name
    expect(convertCyrillicToLatin("ёмон").text).toBe("yomon");
    expect(convertCyrillicToLatin("яхши").text).toBe("yaxşi");
  });

  it("protects URLs and code the same way convertToNew does", () => {
    const result = convertCyrillicToLatin(
      "Сайт: https://example.com/шаҳар матн",
    );
    expect(result.text).toContain("https://example.com/шаҳар");
    expect(result.text).toContain("Sayt:");
  });
});

describe("convertLatinToCyrillic", () => {
  it("converts a simple deterministic word", () => {
    expect(convertLatinToCyrillic("maktab").text).toBe("мактаб");
  });

  it("converts ş -> ш, ç -> ч, ö -> ў, ğ -> ғ, q -> қ, h -> ҳ deterministically", () => {
    expect(convertLatinToCyrillic("şahar").text).toBe("шаҳар");
    expect(convertLatinToCyrillic("çiroyli").text).toBe("чиройли");
    expect(convertLatinToCyrillic("böz").text).toBe("бўз");
    expect(convertLatinToCyrillic("boğ").text).toBe("боғ");
    expect(convertLatinToCyrillic("qalam").text).toBe("қалам");
  });

  it("collapses y+vowel to the iotated Cyrillic letter at a word/vowel boundary", () => {
    expect(convertLatinToCyrillic("Yulduz").text).toBe("Юлдуз");
    expect(convertLatinToCyrillic("yomon").text).toBe("ёмон");
    expect(convertLatinToCyrillic("yaxşi").text).toBe("яхши");
  });

  it("converts the modifier apostrophe back to ъ", () => {
    expect(convertLatinToCyrillic("sanʼat").text).toBe("санъат");
  });

  it("is deterministic for already-new-Latin letters like ş/ç (no ambiguity)", () => {
    expect(convertLatinToCyrillic("Şahar").text).toBe("Шаҳар");
  });

  it("shares the old->new exception dictionary for old-script sh/ch input", () => {
    // "Ishoq" is Is-hoq (a name), not a genuine sh digraph — the same
    // exception dictionary used by convertToNew applies here too.
    expect(convertLatinToCyrillic("Ishoq").text).toBe("Исҳоқ");
  });

  it("accepts old-script input directly: sh/ch/o'/g' are recognized as digraphs, not left as stray Latin letters", () => {
    // Regression test for a real bug: old-script "shahar"/"chiroyli"/"go'zal"
    // was falling through to the plain letter table (s,h,c,h separately),
    // producing garbage like "сҳаҳар" and a stray Latin "c" in the output.
    expect(convertLatinToCyrillic("shahar").text).toBe("шаҳар");
    expect(convertLatinToCyrillic("chiroyli").text).toBe("чиройли");
    expect(convertLatinToCyrillic("go'zal").text).toBe("гўзал");
    expect(convertLatinToCyrillic("Shahar").text).toBe("Шаҳар");
  });

  it("converts the exact sentence reported as broken, end to end", () => {
    const result = convertLatinToCyrillic(
      "Bu shahar juda chiroyli va go'zal. Batafsil: https://saadahbooks.uz/donate",
    );
    expect(result.text).toBe(
      "Бу шаҳар жуда чиройли ва гўзал. Батафсил: https://saadahbooks.uz/donate",
    );
  });
});

describe("Cyrillic <-> Latin round trip on unambiguous words", () => {
  const words = ["maktab", "şahar", "çiroyli", "qalam", "havo"];

  for (const word of words) {
    it(`round-trips "${word}"`, () => {
      const toCyrillic = convertLatinToCyrillic(word).text;
      const backToLatin = convertCyrillicToLatin(toCyrillic).text;
      expect(backToLatin).toBe(word);
    });
  }
});
