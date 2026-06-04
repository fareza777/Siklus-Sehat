import { FoodEntry, Meal, MealPlan, Phase, UserProfile } from "@/models";
import { foodDatabase, foodsForPhase } from "@/data/foodDatabase";
import { nutritionForPhase } from "@/utils/nutrition";
import { todayISO } from "@/utils/date";
import { analyzeFoodWithOpenRouter, chatWithOpenRouter, generateMealPlanWithOpenRouter, isOpenRouterConfigured } from "@/services/openRouterAI";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scoreFoodName(name: string, phase: Phase) {
  const lower = name.toLowerCase();
  return foodDatabase
    .map((food) => {
      const tokenScore = food.name.toLowerCase().split(" ").filter((token) => lower.includes(token)).length;
      const phaseScore = food.phaseTags.includes(phase) ? 2 : 0;
      return { food, score: tokenScore + phaseScore };
    })
    .sort((a, b) => b.score - a.score)[0].food;
}

export async function analyzeFoodImage(imageUri: string, phase: Phase, manualHint = ""): Promise<FoodEntry> {
  if (isOpenRouterConfigured()) {
    try {
      return await analyzeFoodWithOpenRouter(imageUri, phase, manualHint);
    } catch {
      // Keep the app usable during preview if OpenRouter is unavailable.
    }
  }
  await sleep(850);
  const guessed = scoreFoodName(manualHint || imageUri, phase);
  const fit = guessed.phaseTags.includes(phase);
  return {
    id: `food-${Date.now()}`,
    date: todayISO(),
    name: guessed.name,
    imageUri,
    calories: guessed.calories,
    protein: guessed.protein,
    carbs: guessed.carbs,
    fat: guessed.fat,
    phaseFit: fit ? "cocok" : "kurang_cocok",
    advice: fit
      ? `${guessed.name} cocok untuk fase ini karena mendukung ${guessed.micronutrients.join(", ")}.`
      : `Kurangi porsi atau pasangkan dengan makanan fase ini, misalnya ${foodsForPhase(phase)[0]?.name ?? "sayur hijau"}.`,
    source: "scanner"
  };
}

export async function generateMealPlan(profile: UserProfile, phase: Phase, inventory: string[]): Promise<MealPlan> {
  if (isOpenRouterConfigured()) {
    try {
      return await generateMealPlanWithOpenRouter(profile, phase, inventory);
    } catch {
      // Keep local MVP behavior stable when the AI provider fails.
    }
  }
  await sleep(650);
  const target = nutritionForPhase(profile, phase);
  const vegetarianOnly = profile.foodPreferences.includes("vegetarian");
  const pool = foodsForPhase(phase, vegetarianOnly);
  const inventoryLower = inventory.map((item) => item.toLowerCase());
  const sorted = [...pool].sort((a, b) => {
    const aMatch = inventoryLower.some((item) => a.name.toLowerCase().includes(item));
    const bMatch = inventoryLower.some((item) => b.name.toLowerCase().includes(item));
    return Number(bMatch) - Number(aMatch);
  });

  const picks = [sorted[0], sorted[1], sorted[2], sorted[3]].filter(Boolean);
  const meals: Meal[] = picks.map((food, index) => ({
    title: food.name,
    time: (["sarapan", "makan_siang", "makan_malam", "snack"] as const)[index],
    ingredients: [food.name, "sayur lokal", "bumbu sederhana", index === 3 ? "buah atau kacang" : "karbo kompleks"],
    steps: [
      "Siapkan bahan dan cuci sayur.",
      "Masak dengan minyak secukupnya selama 5-15 menit.",
      "Atur porsi sesuai target kalori harian."
    ],
    calories: food.calories,
    protein: food.protein,
    phaseReason: `Mendukung fase ${phase} lewat ${food.micronutrients.join(", ")}.`
  }));

  return {
    id: `plan-${Date.now()}`,
    date: todayISO(),
    phase,
    totalCalories: target.calories,
    meals
  };
}

export async function chatReply(message: string, phase: Phase, profile: UserProfile): Promise<string> {
  if (isOpenRouterConfigured()) {
    try {
      return await chatWithOpenRouter(message, phase, profile);
    } catch {
      // Fallback keeps the mobile preview responsive.
    }
  }
  await sleep(450);
  const target = nutritionForPhase(profile, phase);
  const lower = message.toLowerCase();
  if (lower.includes("manis") || lower.includes("craving")) {
    return `Untuk fase ${phase}, coba snack ${foodsForPhase(phase).find((food) => food.category === "snack")?.name ?? "pisang dan cokelat hitam"} agar craving lebih stabil. Target hari ini sekitar ${target.calories} kkal.`;
  }
  if (lower.includes("pcos")) {
    return "Untuk PCOS, prioritaskan protein tiap makan, karbo kompleks, dan serat. Hindari minuman manis dan pilih porsi nasi yang konsisten.";
  }
  return `Fase sekarang ${phase}. Fokus nutrisi: ${target.micronutrients.join(", ")}. Kirim bahan di rumah, saya bantu susun menu lokal cepat.`;
}
