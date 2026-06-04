import { describe, expect, it } from "vitest";
import { UserProfile } from "@/models";
import { nutritionForPhase } from "@/utils/nutrition";

const profile: UserProfile = {
  id: "u1",
  age: 30,
  heightCm: 162,
  weightKg: 64,
  goal: "turun_bb",
  averageCycleLength: 28,
  lastPeriodStart: "2026-05-01",
  contraception: "Tidak ada",
  healthConditions: [],
  foodPreferences: [],
  allergies: [],
  createdAt: "2026-05-01T00:00:00.000Z"
};

describe("phase-aware nutrition", () => {
  it("adds calories during luteal phase", () => {
    const follicular = nutritionForPhase(profile, "follicular");
    const luteal = nutritionForPhase(profile, "luteal");
    expect(luteal.calories - follicular.calories).toBe(220);
    expect(luteal.micronutrients).toContain("magnesium");
  });

  it("keeps calorie target above a practical minimum", () => {
    const target = nutritionForPhase({ ...profile, weightKg: 42, heightCm: 150 }, "follicular");
    expect(target.calories).toBeGreaterThanOrEqual(1300);
  });
});
