import assert from "node:assert";
import { describe, it } from "node:test";
import { formatInstantInTimeZone, parseDbInstant } from "./zoned-time-format.js";

describe("parseDbInstant", () => {
  it("treats Postgres naive wall clock as UTC (append Z)", () => {
    const d = parseDbInstant("2026-05-14 15:30:00");
    assert.ok(d);
    assert.strictEqual(d.toISOString(), "2026-05-14T15:30:00.000Z");
  });

  it("passes through explicit Z", () => {
    const d = parseDbInstant("2026-05-14T15:30:00.000Z");
    assert.ok(d);
    assert.strictEqual(d.toISOString(), "2026-05-14T15:30:00.000Z");
  });
});

describe("formatInstantInTimeZone", () => {
  it("maps naive UTC 15:30 to 12:30 in Buenos Aires", () => {
    const parts = formatInstantInTimeZone(
      "2026-05-14 15:30:00",
      "America/Argentina/Buenos_Aires"
    );
    assert.deepStrictEqual(parts, {
      calendarDate: "2026-05-14",
      timeHm: "12:30",
    });
  });
});
