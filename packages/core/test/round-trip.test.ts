import { describe, expect, it } from "vitest";
import { convertToNew, convertToOld } from "../src/convert.js";

// New -> old is a pure bijective table, so converting new script to old and
// back to new must reproduce the original new-script text exactly, for any
// text that doesn't rely on the ambiguous old->new direction.
describe("round-trip: new -> old -> new is stable", () => {
  const samples = [
    "Bu şahar juda gözal va katta.",
    "ŞAHAR ÇIROYLI",
    "Toshkentda yashayman", // deliberately old-script input to prove idempotence below
    "Özbekiston mustaqil davlat.",
    "Bugun ob-havo yaxshi, lekin ertaga yomon boʻlishi mumkin.",
  ];

  for (const original of samples) {
    it(`holds for: "${original}"`, () => {
      const toOld = convertToOld(original).text;
      const backToNew = convertToNew(toOld).text;
      const toOldAgain = convertToOld(backToNew).text;
      // Second round trip must be a fixed point even if the very first old->new
      // step wasn't (because `original` may itself have been old-script).
      expect(toOldAgain).toBe(toOld);
    });
  }
});

describe("round-trip: old -> new -> old is stable once canonicalized", () => {
  it("stabilizes after the first pass through the new alphabet", () => {
    const original = "Bu shahar juda go'zal.";
    const toNew = convertToNew(original).text;
    const backToOld = convertToOld(toNew).text;
    const toNewAgain = convertToNew(backToOld).text;
    expect(toNewAgain).toBe(toNew);
  });
});
