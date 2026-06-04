import { Goal, Phase, UserProfile } from "@/models";

export type NutritionTarget = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients: string[];
  guidance: string;
};

function baseCalories(profile: UserProfile): number {
  const bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age - 161;
  const lightlyActive = bmr * 1.35;
  const goalAdjustment: Record<Goal, number> = {
    turun_bb: -250,
    maintain: 0,
    fertility: 100,
    pcos: -100
  };
  return Math.round(lightlyActive + goalAdjustment[profile.goal]);
}

export function nutritionForPhase(profile: UserProfile, phase: Phase): NutritionTarget {
  const phaseAdjustment = phase === "luteal" ? 220 : phase === "menstrual" ? 60 : 0;
  const calories = Math.max(1300, baseCalories(profile) + phaseAdjustment);
  const protein = Math.round(profile.weightKg * (profile.goal === "turun_bb" || profile.goal === "pcos" ? 1.6 : 1.35));
  const fat = Math.round((calories * 0.28) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  const phaseData = {
    menstrual: {
      micronutrients: ["zat besi", "Vitamin C", "folat"],
      guidance: "Bayam, daging sapi tanpa lemak, tempe, dan jeruk membantu dukung energi."
    },
    follicular: {
      micronutrients: ["protein", "B vitamin", "serat"],
      guidance: "Ayam, ikan, nasi merah, dan brokoli cocok untuk energi dan pemulihan."
    },
    ovulation: {
      micronutrients: ["antioksidan", "zinc", "omega-3"],
      guidance: "Seafood, labu, jambu, dan buah beri lokal mendukung fase subur."
    },
    luteal: {
      micronutrients: ["magnesium", "karbo kompleks", "kalsium"],
      guidance: "Tempe, kacang mete, cokelat hitam, dan sayur hijau membantu craving."
    }
  }[phase];

  return { calories, protein, carbs, fat, ...phaseData };
}
