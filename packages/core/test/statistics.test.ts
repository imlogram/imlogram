import { describe, expect, it } from "vitest";
import { getStatistics } from "../src/statistics.js";

describe("getStatistics", () => {
  it("counts old-script digraphs and apostrophe letters", () => {
    const stats = getStatistics("Shahar chiroyli, bog'da o'ynayapmiz.");
    expect(stats.letterCounts["sh"]).toBe(1);
    expect(stats.letterCounts["ch"]).toBe(1);
    expect(stats.letterCounts["gʻ"]).toBe(1);
    expect(stats.letterCounts["oʻ"]).toBe(1);
    expect(stats.totalSpecialChars).toBe(4);
  });

  it("counts new-script letters", () => {
    const stats = getStatistics("Şahar çiroyli, boğda öynayapmiz.");
    expect(stats.letterCounts["ş"]).toBe(1);
    expect(stats.letterCounts["ç"]).toBe(1);
    expect(stats.letterCounts["ğ"]).toBe(1);
    expect(stats.letterCounts["ö"]).toBe(1);
  });

  it("does not count matches inside protected zones", () => {
    const stats = getStatistics(
      "Matn https://saadahbooks.uz/donate/Chart oxiri.",
    );
    expect(stats.totalSpecialChars).toBe(0);
  });
});
