import { describe, expect, it } from "vitest";
import { CycleDay, UserProfile } from "@/models";
import { averageCycleLength, getCyclePrediction, phaseForCycleDay } from "@/utils/phase";

const profile: UserProfile = {
  id: "u1",
  age: 28,
  heightCm: 160,
  weightKg: 58,
  goal: "maintain",
  averageCycleLength: 28,
  lastPeriodStart: "2026-05-01",
  contraception: "Tidak ada",
  healthConditions: [],
  foodPreferences: ["halal"],
  allergies: [],
  createdAt: "2026-05-01T00:00:00.000Z"
};

describe("cycle phase prediction", () => {
  it("uses 3 recent cycle starts when available", () => {
    const days: CycleDay[] = [
      { date: "2026-03-01", period: "start", spotting: false, symptoms: [], notes: "" },
      { date: "2026-03-30", period: "start", spotting: false, symptoms: [], notes: "" },
      { date: "2026-04-28", period: "start", spotting: false, symptoms: [], notes: "" },
      { date: "2026-05-27", period: "start", spotting: false, symptoms: [], notes: "" }
    ];
    expect(averageCycleLength(profile, days)).toBe(29);
  });

  it("maps cycle day to the expected phase", () => {
    expect(phaseForCycleDay(3, 28)).toBe("menstrual");
    expect(phaseForCycleDay(8, 28)).toBe("follicular");
    expect(phaseForCycleDay(14, 28)).toBe("ovulation");
    expect(phaseForCycleDay(22, 28)).toBe("luteal");
  });

  it("predicts ovulation as cycle length minus 14 days", () => {
    const prediction = getCyclePrediction(profile, [], "2026-05-14");
    expect(prediction.cycleDay).toBe(14);
    expect(prediction.phase).toBe("ovulation");
    expect(prediction.ovulationDate).toBe("2026-05-14");
    expect(prediction.nextPeriod).toBe("2026-05-29");
    expect(prediction.fertileWindow).toContain("2026-05-09");
  });
});
