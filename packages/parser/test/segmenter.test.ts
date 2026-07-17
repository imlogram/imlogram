import { describe, expect, it } from "vitest";
import { segment } from "../src/segmenter.js";

function kinds(text: string) {
  return segment(text).map((s) => s.kind);
}

function raws(text: string) {
  return segment(text).map((s) => s.raw);
}

describe("segment", () => {
  it("returns a single text segment for plain prose", () => {
    const segs = segment("Shahar go'zal");
    expect(segs).toHaveLength(1);
    expect(segs[0].kind).toBe("text");
  });

  it("protects a bare URL", () => {
    const segs = segment("Sayt: https://saadahbooks.uz/donate bor.");
    expect(kinds("Sayt: https://saadahbooks.uz/donate bor.")).toEqual([
      "text",
      "url",
      "text",
    ]);
    expect(raws("Sayt: https://saadahbooks.uz/donate bor.")[1]).toBe(
      "https://saadahbooks.uz/donate",
    );
  });

  it("trims trailing sentence punctuation off a URL match", () => {
    const segs = segment("Havola: https://saadahbooks.uz/donate.");
    const urlSeg = segs.find((s) => s.kind === "url")!;
    expect(urlSeg.raw).toBe("https://saadahbooks.uz/donate");
  });

  it("protects an email address", () => {
    const segs = segment("Yozing: shukur@example.uz iltimos");
    expect(segs.find((s) => s.kind === "email")?.raw).toBe("shukur@example.uz");
  });

  it("protects fenced code blocks entirely", () => {
    const text = "Kod:\n```js\nconst ShoppingCart = 1;\n```\nTugadi.";
    const segs = segment(text);
    const code = segs.find((s) => s.kind === "code-block");
    expect(code?.raw).toContain("ShoppingCart");
  });

  it("protects inline code", () => {
    const segs = segment("Bu `ShoppingCart` klassi.");
    expect(segs.find((s) => s.kind === "inline-code")?.raw).toBe(
      "`ShoppingCart`",
    );
  });

  it("protects html tags and their attributes, leaving text nodes as text", () => {
    const segs = segment('<div class="ShoppingCart">Shahar</div>');
    const tagRaws = segs.filter((s) => s.kind === "html-tag").map((s) => s.raw);
    expect(tagRaws).toEqual(['<div class="ShoppingCart">', "</div>"]);
    expect(segs.find((s) => s.kind === "text")?.raw).toBe("Shahar");
  });

  it("protects front matter at the start of a document", () => {
    const text = "---\ntitle: Shu narsa\n---\nShahar go'zal";
    const segs = segment(text);
    expect(segs[0].kind).toBe("front-matter");
    expect(segs[0].raw).toContain("title: Shu narsa");
    expect(segs[1].kind).toBe("text");
    expect(segs[1].raw).toBe("Shahar go'zal");
  });

  it("does not protect front matter-looking text mid-document", () => {
    const text = "Shu yerda\n---\nboshqa narsa\n---\ndavomi";
    const segs = segment(text);
    expect(segs.every((s) => s.kind !== "front-matter")).toBe(true);
  });

  it("covers the entire input without gaps or overlaps", () => {
    const text =
      "Salom https://example.com <b>Shahar</b> shukur@example.uz `code` davomi";
    const segs = segment(text);
    let cursor = 0;
    for (const s of segs) {
      expect(s.start).toBe(cursor);
      cursor = s.end;
    }
    expect(cursor).toBe(text.length);
  });

  it("reassembling all segment.raw values reproduces the original text", () => {
    const text =
      'Import: import Shopping from "./Shop"; ko\'proq https://github.com matn.';
    const segs = segment(text);
    expect(segs.map((s) => s.raw).join("")).toBe(text);
  });
});
