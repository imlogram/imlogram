import { describe, expect, it, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { scanProject } from "../src/scan.js";
import { applyCandidates } from "../src/apply.js";

const dirs: string[] = [];

function makeTempProject(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "imlogram-cli-test-"));
  dirs.push(dir);
  for (const [relPath, content] of Object.entries(files)) {
    const full = join(dir, relPath);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content, "utf8");
  }
  return dir;
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("scanProject", () => {
  it("finds convertible text but not code (identifiers, classNames, imports)", () => {
    const dir = makeTempProject({
      "src/Button.tsx": [
        `import { useState } from "react";`,
        `const LABELS = { old: "Eski alifbo", tailwind: "rounded-full px-4 hover:shadow-sm" };`,
        `export function Button({ showChanges }) {`,
        `  return <label placeholder="Matnni shu yerga yozing...">Kirish matni</label>;`,
        `}`,
      ].join("\n"),
    });

    const candidates = scanProject(dir, "old_to_new");
    const originals = candidates.map((c) => c.original);

    expect(originals).toContain("Matnni shu yerga yozing...");
    expect(originals).toContain("Kirish matni");
    // "Eski alifbo" has no digraph, so converting it is a no-op and it must
    // not show up as a candidate needing approval.
    expect(originals).not.toContain("Eski alifbo");
    // Nothing derived from code structure should ever appear as a candidate.
    expect(originals.join(" ")).not.toContain("showChanges");
    expect(originals.join(" ")).not.toContain("rounded-full");
    expect(originals.join(" ")).not.toContain("react");
  });

  it("ignores non-source files and common build/dependency directories", () => {
    // Deliberately a multi-word phrase, not a bare single lowercase word like
    // "shahar" — a bare word is structurally indistinguishable from a CSS
    // class name and is *correctly* left as protected code by design (see
    // looksLikeCodeToken in @imlogram/parser's source-code segmenter).
    const text = `const x = "Kirish matni";`;
    const dir = makeTempProject({
      "README.md": "Bu shahar juda chiroyli.",
      "node_modules/pkg/index.js": text,
      "dist/index.js": text,
      "src/ok.ts": text,
    });

    const candidates = scanProject(dir, "old_to_new");
    expect(candidates).toHaveLength(1);
    expect(candidates[0].file).toBe(join(dir, "src", "ok.ts"));
  });

  it("computes 1-indexed line/column for each candidate, for editor deep links", () => {
    const dir = makeTempProject({
      "src/a.ts": [`const a = 1;`, `const label = "Kirish matni";`, `const b = 2;`].join("\n"),
    });
    const candidates = scanProject(dir, "old_to_new");
    expect(candidates).toHaveLength(1);
    expect(candidates[0].line).toBe(2);
    expect(candidates[0].column).toBe(16);
  });

  it("supports the new-to-old direction too", () => {
    const dir = makeTempProject({
      "src/a.ts": `const label = "Şahar";`,
    });
    const candidates = scanProject(dir, "new_to_old");
    expect(candidates).toHaveLength(1);
    expect(candidates[0].converted).toBe("Shahar");
  });
});

describe("applyCandidates", () => {
  it("writes only approved candidates to disk, leaving the rest untouched", () => {
    const dir = makeTempProject({
      "src/a.ts": `const a = "Kirish"; const b = "Chiroyli";`,
    });
    const file = join(dir, "src/a.ts");
    const candidates = scanProject(dir, "old_to_new");
    expect(candidates).toHaveLength(2);

    // Approve only the first candidate found.
    candidates[0].approved = true;
    candidates[1].approved = false;

    const summary = applyCandidates(candidates);
    expect(summary).toEqual([{ file, count: 1 }]);

    const updated = readFileSync(file, "utf8");
    expect(updated).toContain(candidates[0].converted);
    expect(updated).toContain("Chiroyli"); // left untouched, not converted to Çiroyli
  });

  it("writes nothing when no candidates are approved", () => {
    const dir = makeTempProject({ "src/a.ts": `const a = "Kirish matni";` });
    const file = join(dir, "src/a.ts");
    const original = readFileSync(file, "utf8");
    const candidates = scanProject(dir, "old_to_new").map((c) => ({ ...c, approved: false }));

    const summary = applyCandidates(candidates);
    expect(summary).toHaveLength(0);
    expect(readFileSync(file, "utf8")).toBe(original);
  });
});
