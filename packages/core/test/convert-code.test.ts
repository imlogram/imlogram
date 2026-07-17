import { describe, expect, it } from "vitest";
import { convertCodeToNew } from "../src/convert.js";

// Ground truth for these fixtures: real excerpts adapted from
// apps/web/components/ConverterPanel.tsx — code we hand-converted ourselves
// earlier in this project, so we know exactly what "correct" looks like.

describe("convertCodeToNew — never breaks the code", () => {
  it("does not mangle an identifier that starts with a digraph (showChanges)", () => {
    const source = `const [showChanges, setShowChanges] = useState(true);`;
    const result = convertCodeToNew(source);
    expect(result.text).toBe(source);
  });

  it("does not touch import specifiers, including mixed-case component paths", () => {
    const source = `import { ConverterPanel } from "@/components/ConverterPanel";\nimport { useMemo, useState } from "react";`;
    const result = convertCodeToNew(source);
    expect(result.text).toBe(source);
  });

  it("does not touch a Tailwind class string stored in a plain object literal", () => {
    const source = `const BADGE_CLASS = {\n  old: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 shadow-sm",\n};`;
    const result = convertCodeToNew(source);
    expect(result.text).toBe(source);
  });

  it("does not touch className, only the JSX text node, in a real button element", () => {
    const source = `<button className={\`rounded-full border px-4 py-1.5 text-sm font-medium transition \${mode === m.value ? "border-brand-600 bg-brand-600 text-white shadow-soft" : "border-slate-300 text-slate-600"}\`}>\n  {m.label}\n</button>`;
    const result = convertCodeToNew(source);
    // className expression (Tailwind classes + ternary) must survive untouched
    expect(result.text).toContain('border-brand-600 bg-brand-600 text-white shadow-soft');
    expect(result.text).toContain('border-slate-300 text-slate-600');
    expect(result.text).toContain("{m.label}");
  });

  it("round-trips a syntactically valid file through convertCodeToNew without producing a parse error shape (braces/quotes balanced)", () => {
    const source = `export function Widget({ showChanges }: Props) {\n  return (\n    <div className="rounded-full border px-4 py-1.5 hover:shadow-sm">\n      <label placeholder="Matnni shu yerga yozing...">Kirish matni</label>\n    </div>\n  );\n}`;
    const result = convertCodeToNew(source);
    expect((result.text.match(/</g) ?? []).length).toBe((source.match(/</g) ?? []).length);
    expect((result.text.match(/\{/g) ?? []).length).toBe((source.match(/\{/g) ?? []).length);
    expect((result.text.match(/"/g) ?? []).length).toBe((source.match(/"/g) ?? []).length);
  });
});

describe("convertCodeToNew — converts real UI text", () => {
  it("converts natural-language values in a labels object, leaving keys untouched", () => {
    const source = [
      "const LABELS: Record<string, string> = {",
      '  old: "Eski alifbo",',
      '  mixed: "Aralash yozuv",',
      "};",
    ].join("\n");
    const result = convertCodeToNew(source);
    expect(result.text).toContain('"Aralaş yozuv"'); // sh -> ş actually converted
    expect(result.text).toContain("old:"); // object key untouched
    expect(result.text).toContain("mixed:");
  });

  it("converts JSX text content and a translatable placeholder attribute", () => {
    const source = `<textarea placeholder="Matnni shu yerga yozing yoki joylashtiring..." />\n<label>Kirish matni</label>`;
    const result = convertCodeToNew(source);
    expect(result.text).toContain('placeholder="Matnni şu yerga yozing yoki joylaştiring..."');
    expect(result.text).toContain("<label>Kiriş matni</label>");
  });

  it("converts the real ConverterPanel labels array end to end", () => {
    const source = [
      "const MODES = [",
      '  { value: "auto", label: "Avtomatik aniqlash" },',
      '  { value: "old_to_new", label: "Eski -> Yangi" },',
      "];",
    ].join("\n");
    const result = convertCodeToNew(source);
    expect(result.text).toContain('"Avtomatik aniqlaş"');
    expect(result.text).toContain('value: "auto"'); // enum-like code value must NOT be touched
    expect(result.text).toContain('value: "old_to_new"');
  });

  it("converts text that follows a {expression} inside JSX (the stats line pattern)", () => {
    const source = "<span>{result.stats.charCount} belgi · {result.stats.wordCount} so'z</span>";
    const result = convertCodeToNew(source);
    expect(result.text).toContain("{result.stats.charCount} belgi");
    expect(result.text).toContain("{result.stats.wordCount} söz");
  });
});
