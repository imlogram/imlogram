import { describe, expect, it } from "vitest";
import { convertToNew, convertToOld } from "../src/convert.js";

describe("protected zones are never converted", () => {
  it("leaves a URL untouched even though it contains Sh/Ch-like substrings", () => {
    const input =
      "Saytga o'ting: https://saadahbooks.uz/donate/Chart bo'yicha.";
    const result = convertToNew(input);
    expect(result.text).toBe(
      "Saytga öting: https://saadahbooks.uz/donate/Chart böyiça.",
    );
  });

  it("leaves an email address untouched", () => {
    const input = "Yozing: shukur@example.uz iltimos";
    const result = convertToNew(input);
    expect(result.text).toContain("shukur@example.uz");
  });

  it("leaves fenced code blocks untouched, including identifiers like ShoppingCart", () => {
    const input =
      "Kod:\n```js\nconst ShoppingCart = 1;\nimport Shopping from './shop';\n```\nShahar haqida.";
    const result = convertToNew(input);
    expect(result.text).toContain("const ShoppingCart = 1;");
    expect(result.text).toContain("import Shopping from './shop';");
    expect(result.text).toContain("Şahar haqida.");
  });

  it("leaves inline code untouched", () => {
    const result = convertToNew("Bu `ShoppingCart` klassi shunday.");
    expect(result.text).toBe("Bu `ShoppingCart` klassi şunday.");
  });

  it("leaves HTML tags and attribute values untouched, converts text nodes", () => {
    const result = convertToNew('<div class="ShoppingCart">Shahar</div>');
    expect(result.text).toBe('<div class="ShoppingCart">Şahar</div>');
  });

  it("respects protectUrls: false", () => {
    const result = convertToNew("https://saadahbooks.uz/Shop", {
      protectUrls: false,
    });
    expect(result.text).not.toBe("https://saadahbooks.uz/Shop");
  });
});

describe("changes tracking", () => {
  it("records start/end offsets for each conversion", () => {
    const result = convertToNew("Shahar");
    expect(result.changes).toEqual([
      { start: 0, end: 2, from: "Sh", to: "Ş", reason: "digraph" },
    ]);
  });

  it("does not record a change for an exception-skipped digraph", () => {
    const result = convertToNew("Ishoq");
    expect(result.changes).toHaveLength(0);
    expect(result.text).toBe("Ishoq");
  });
});

describe("stats", () => {
  it("computes char/word/changed counts", () => {
    const result = convertToNew("Shahar go'zal");
    expect(result.stats.wordCount).toBe(2);
    expect(result.stats.changedCount).toBe(2);
    expect(result.stats.charCount).toBe(result.text.length);
  });
});

describe("new -> old direction", () => {
  it("is a pure deterministic table lookup with no exceptions needed", () => {
    const result = convertToOld("Şahar gözal");
    expect(result.text).toBe("Shahar goʻzal");
  });

  it("protects fenced code and URLs in the reverse direction too", () => {
    const result = convertToOld(
      "```\nconst şahar = 1;\n``` gözal https://example.com/şahar",
    );
    expect(result.text).toBe(
      "```\nconst şahar = 1;\n``` goʻzal https://example.com/şahar",
    );
  });
});
