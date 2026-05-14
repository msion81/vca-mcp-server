import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAthleteNameSqlConditions,
  escapeIlikePattern,
  stripLatinAccents,
  tokenizeNameQuery,
} from "./athleteSearchName.js";

describe("buildAthleteNameSqlConditions", () => {
  it("returns two AND fragments for explicit name + lastName", () => {
    const { conditions, useDisplayNameRanking } = buildAthleteNameSqlConditions({
      name: "Maria",
      lastName: "Lopez",
    });
    assert.equal(conditions.length, 2);
    assert.equal(useDisplayNameRanking, true);
  });

  it("returns one fragment per token for free-text name only", () => {
    const { conditions, useDisplayNameRanking } = buildAthleteNameSqlConditions({
      name: "Maria Inés López",
    });
    assert.equal(conditions.length, 3);
    assert.equal(useDisplayNameRanking, true);
  });

  it("returns one fragment for lastName only", () => {
    const { conditions, useDisplayNameRanking } = buildAthleteNameSqlConditions({
      lastName: "Perez",
    });
    assert.equal(conditions.length, 1);
    assert.equal(useDisplayNameRanking, true);
  });

  it("returns empty when no name filters", () => {
    const { conditions, useDisplayNameRanking } = buildAthleteNameSqlConditions({});
    assert.equal(conditions.length, 0);
    assert.equal(useDisplayNameRanking, false);
  });
});

describe("stripLatinAccents", () => {
  it("strips Spanish diacritics", () => {
    assert.equal(stripLatinAccents("María Inés"), "maria ines");
    assert.equal(stripLatinAccents("LÓPEZ"), "lopez");
    assert.equal(stripLatinAccents("Niño"), "nino");
  });

  it("handles œ and ß digraphs", () => {
    assert.equal(stripLatinAccents("œuf"), "oeuf");
    assert.equal(stripLatinAccents("Straße"), "strasse");
  });
});

describe("tokenizeNameQuery", () => {
  it("splits compound names into accent-free tokens", () => {
    assert.deepEqual(tokenizeNameQuery("Maria Inés"), ["maria", "ines"]);
    assert.deepEqual(tokenizeNameQuery("  Maria   Inés  "), ["maria", "ines"]);
  });

  it("supports surname-only style queries", () => {
    assert.deepEqual(tokenizeNameQuery("Lopez Perez"), ["lopez", "perez"]);
  });

  it("returns one short token when the whole query is a single short word", () => {
    assert.deepEqual(tokenizeNameQuery("Li"), ["li"]);
    assert.deepEqual(tokenizeNameQuery("L"), ["l"]);
  });
});

describe("escapeIlikePattern", () => {
  it("escapes ILIKE metacharacters", () => {
    assert.equal(escapeIlikePattern("a%b_c\\d"), "a\\%b\\_c\\\\d");
  });
});
