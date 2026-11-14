import { describe, expect, it } from "vitest";

import { SIMULATED_NOW, SIMULATED_NOW_ISO } from "@/lib/clock";

describe("simulated clock", () => {
  it("is pinned to 11/11/2026 09:00 GMT+7", () => {
    expect(SIMULATED_NOW_ISO).toBe("2026-11-11T09:00:00+07:00");
    expect(SIMULATED_NOW.toISOString()).toBe("2026-11-11T02:00:00.000Z");
  });

  it("is not the current time", () => {
    expect(SIMULATED_NOW.getTime()).not.toBe(Date.now());
  });
});
