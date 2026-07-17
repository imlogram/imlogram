import { describe, expect, it } from "vitest";
import { convertToNew, convertToOld } from "../src/convert.js";
import oldToNewFixtures from "./fixtures/old-to-new.json";
import newToOldFixtures from "./fixtures/new-to-old.json";

interface Fixture {
  description: string;
  input: string;
  expected: string;
}

describe("convertToNew fixtures (old -> new)", () => {
  for (const fixture of oldToNewFixtures as Fixture[]) {
    it(fixture.description, () => {
      expect(convertToNew(fixture.input).text).toBe(fixture.expected);
    });
  }
});

describe("convertToOld fixtures (new -> old)", () => {
  for (const fixture of newToOldFixtures as Fixture[]) {
    it(fixture.description, () => {
      expect(convertToOld(fixture.input).text).toBe(fixture.expected);
    });
  }
});
