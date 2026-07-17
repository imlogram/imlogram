import { describe, expect, it } from "vitest";
import { detect } from "../src/detect.js";

describe("detect", () => {
  it("classifies pure old-script text as old", () => {
    const result = detect("Bu shahar juda go'zal va katta.");
    expect(result.classification).toBe("old");
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("classifies pure new-script text as new", () => {
    const result = detect("Bu şahar juda gözal va katta.");
    expect(result.classification).toBe("new");
  });

  it("classifies text with both scripts as mixed", () => {
    const result = detect("Bu shahar juda gözal.");
    expect(result.classification).toBe("mixed");
  });

  it("ignores old-looking markers inside protected zones when classifying", () => {
    const result = detect(
      "Bu şahar https://saadahbooks.uz/donate/Chart gözal.",
    );
    expect(result.classification).toBe("new");
  });

  it("returns per-segment classification with offsets", () => {
    const text = "shahar";
    const result = detect(text);
    expect(result.segments).toEqual([
      { start: 0, end: 6, classification: "old" },
    ]);
  });

  it("pinpoints which sentence is old and which is new in mixed paragraphs", () => {
    const text = "Bu shahar juda chiroyli. Bu şahar esa juda gözal.";
    const result = detect(text);
    expect(result.classification).toBe("mixed");
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0].classification).toBe("old");
    expect(text.slice(result.segments[0].start, result.segments[0].end)).toBe(
      "Bu shahar juda chiroyli. ",
    );
    expect(result.segments[1].classification).toBe("new");
    expect(text.slice(result.segments[1].start, result.segments[1].end)).toBe(
      "Bu şahar esa juda gözal.",
    );
  });
});
