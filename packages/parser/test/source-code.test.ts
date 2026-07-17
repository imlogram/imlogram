import { describe, expect, it } from "vitest";
import { segmentSourceCode } from "../src/source-code.js";

function textParts(source: string): string[] {
  return segmentSourceCode(source)
    .filter((s) => s.kind === "text")
    .map((s) => s.raw);
}

describe("segmentSourceCode — full-coverage invariants", () => {
  it("covers the entire input with contiguous, non-overlapping segments", () => {
    const source = `
import { useState } from "react";

const LABELS = { old: "Eski alifbo", mixed: "Aralash yozuv" };

export function Widget({ showChanges }: Props) {
  return (
    <div className="rounded-full border px-4 py-1.5 text-sm">
      <label placeholder="Matnni shu yerga yozing...">Kirish matni</label>
    </div>
  );
}
`;
    const segments = segmentSourceCode(source);
    let cursor = 0;
    for (const s of segments) {
      expect(s.start).toBe(cursor);
      cursor = s.end;
    }
    expect(cursor).toBe(source.length);
  });

  it("reassembling every segment.raw reproduces the original source exactly", () => {
    const source = `const x = \`hello \${showChanges ? "border-brand-600 text-white" : "border-slate-300"} world\`;\nconst y = 'Eski alifbo';\n`;
    const segments = segmentSourceCode(source);
    expect(segments.map((s) => s.raw).join("")).toBe(source);
  });
});

describe("segmentSourceCode — protects code structure", () => {
  it("never marks an identifier like showChanges as convertible text", () => {
    const source = `const [showChanges, setShowChanges] = useState(true);`;
    expect(textParts(source).join("")).not.toMatch(/showChanges/);
  });

  it("never marks an import path as convertible text", () => {
    const source = `import { ConverterPanel } from "@/components/ConverterPanel";`;
    expect(textParts(source).join("")).toBe("");
  });

  it("protects a Tailwind class string assigned to a plain variable", () => {
    const source = `const BADGE_CLASS = "bg-amber-100 text-amber-800 dark:bg-amber-900/40 shadow-sm";`;
    expect(textParts(source).join("")).toBe("");
  });

  it("never marks a SCREAMING_SNAKE_CASE env var name as convertible text", () => {
    const source = `feedbackChannelId: required("FEEDBACK_CHANNEL_ID"),`;
    expect(textParts(source).join("")).not.toMatch(/CHANNEL/);
  });

  it("protects className attribute values inside JSX tags", () => {
    const source = `<div className="rounded-full border px-4 py-1.5 hover:shadow-sm">Kirish</div>`;
    const text = textParts(source).join(" ");
    expect(text).not.toContain("rounded-full");
    expect(text).not.toContain("shadow-sm");
  });

  it("protects the ${...} expression inside a template literal, including nested strings", () => {
    const source = "const cls = `base ${mode === m.value ? \"border-brand-600 text-white\" : \"border-slate-300\"}`;";
    const text = textParts(source).join("");
    expect(text).not.toContain("border-brand-600");
    expect(text).not.toContain("border-slate-300");
  });
});

describe("segmentSourceCode — surfaces natural-language text", () => {
  it("marks a natural-language string literal value as text", () => {
    const source = `const LABELS = { old: "Eski alifbo", mixed: "Aralash yozuv" };`;
    const text = textParts(source);
    expect(text).toContain("Eski alifbo");
    expect(text).toContain("Aralash yozuv");
  });

  it("marks JSX text content as text", () => {
    const source = `<label>Kirish matni</label>`;
    expect(textParts(source)).toContain("Kirish matni");
  });

  it("marks a translatable attribute (placeholder) value as text but not className", () => {
    const source = `<textarea className="w-full rounded-lg" placeholder="Matnni shu yerga yozing..." />`;
    const text = textParts(source).join(" ");
    expect(text).toContain("Matnni shu yerga yozing...");
    expect(text).not.toContain("w-full");
  });

  it("does not surface JSX expression children ({...}) as text", () => {
    const source = `<span>{result.stats.charCount} belgi</span>`;
    const text = textParts(source).join("");
    expect(text).not.toContain("result.stats.charCount");
    expect(text).toContain("belgi");
  });
});
