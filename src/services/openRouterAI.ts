import { FoodEntry, Meal, MealPlan, Phase, UserProfile } from "@/models";
import { foodDatabase, foodsForPhase } from "@/data/foodDatabase";
import { nutritionForPhase } from "@/utils/nutrition";
import { todayISO } from "@/utils/date";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.EXPO_PUBLIC_OPENROUTER_MODEL || "xiaomi/mimo-v2.5";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

function apiKey() {
  return process.env.EXPO_PUBLIC_OPENROUTER_API_KEY?.trim();
}

export function isOpenRouterConfigured() {
  return Boolean(apiKey());
}

function extractJson<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("OpenRouter response did not include JSON.");
  }
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

async function requestText(messages: ChatMessage[]) {
  const key = apiKey();
  if (!key) {
    throw new Error("OpenRouter API key is not configured.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/fareza777/Siklus-Sehat",
      "X-Title": "SiklusFit"
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.45,
      max_tokens: 900
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with ${response.status}.`);
  }

  const json = await response.json() as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }
  return content;
}

function clampNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : fallback;
}

export async function analyzeFoodWithOpenRouter(imageUri: string, phase: Phase, manualHint: string): Promise<FoodEntry> {
  const foodNames = foodDatabase.slice(0, 32).map((food) => `${food.name} (${food.calories} kkal)`).join(", ");
  const content = await requestText([
    {
      role: "system",
      content: "Anda adalah ahli nutrisi wanita Indonesia. Jawab hanya JSON valid tanpa markdown."
    },
    {
      role: "user",
      content: `Analisis makanan Indonesia untuk fase siklus ${phase}. Foto berada di URI lokal app: ${imageUri}. Gunakan hint user bila ada: "${manualHint}". Pilih estimasi paling masuk akal dari database berikut: ${foodNames}. Return JSON: {"name":string,"calories":number,"protein":number,"carbs":number,"fat":number,"phaseFit":"cocok"|"kurang_cocok","advice":string}.`
    }
  ]);
  const parsed = extractJson<Partial<FoodEntry>>(content);
  const fallback = foodsForPhase(phase)[0] ?? foodDatabase[0];
  return {
    id: `food-${Date.now()}`,
    date: todayISO(),
    name: String(parsed.name || fallback.name),
    imageUri,
    calories: clampNumber(parsed.calories, fallback.calories),
    protein: clampNumber(parsed.protein, fallback.protein),
    carbs: clampNumber(parsed.carbs, fallback.carbs),
    fat: clampNumber(parsed.fat, fallback.fat),
    phaseFit: parsed.phaseFit === "kurang_cocok" ? "kurang_cocok" : "cocok",
    advice: String(parsed.advice || `${fallback.name} dapat disesuaikan dengan porsi dan kebutuhan fase ${phase}.`),
    source: "scanner"
  };
}

export async function generateMealPlanWithOpenRouter(profile: UserProfile, phase: Phase, inventory: string[]): Promise<MealPlan> {
  const target = nutritionForPhase(profile, phase);
  const content = await requestText([
    {
      role: "system",
      content: "Anda adalah meal planner kesehatan wanita Indonesia. Buat menu halal dan realistis 5-15 menit. Jawab hanya JSON valid."
    },
    {
      role: "user",
      content: `Profil: usia ${profile.age}, BB ${profile.weightKg}kg, goal ${profile.goal}, preferensi ${profile.foodPreferences.join(", ") || "halal"}, alergi ${profile.allergies.join(", ") || "tidak ada"}. Fase ${phase}. Target ${target.calories} kkal, protein ${target.protein}g. Inventory: ${inventory.join(", ") || "bebas bahan lokal"}. Return JSON: {"meals":[{"title":string,"time":"sarapan"|"makan_siang"|"makan_malam"|"snack","ingredients":string[],"steps":string[],"calories":number,"protein":number,"phaseReason":string}]}`
    }
  ]);
  const parsed = extractJson<{ meals?: Partial<Meal>[] }>(content);
  const fallback = foodsForPhase(phase).slice(0, 4);
  const fallbackMeals: Partial<Meal>[] = fallback.map((food, index) => ({
    title: food.name,
    time: (["sarapan", "makan_siang", "makan_malam", "snack"] as const)[index],
    calories: food.calories,
    protein: food.protein,
    phaseReason: `Mendukung fase ${phase}.`
  }));
  const rawMeals: Partial<Meal>[] = parsed.meals?.length ? parsed.meals : fallbackMeals;
  const meals = rawMeals.slice(0, 4).map((meal, index): Meal => ({
    title: String(meal.title || fallback[index]?.name || "Menu lokal seimbang"),
    time: (meal.time === "makan_siang" || meal.time === "makan_malam" || meal.time === "snack" || meal.time === "sarapan")
      ? meal.time
      : (["sarapan", "makan_siang", "makan_malam", "snack"] as const)[index],
    ingredients: Array.isArray(meal.ingredients) && meal.ingredients.length ? meal.ingredients.map(String) : ["protein lokal", "sayur", "karbo kompleks"],
    steps: Array.isArray(meal.steps) && meal.steps.length ? meal.steps.map(String) : ["Siapkan bahan.", "Masak 5-15 menit.", "Sajikan hangat."],
    calories: clampNumber(meal.calories, fallback[index]?.calories ?? 350),
    protein: clampNumber(meal.protein, fallback[index]?.protein ?? 18),
    phaseReason: String(meal.phaseReason || `Disesuaikan untuk fase ${phase}.`)
  }));

  return {
    id: `plan-${Date.now()}`,
    date: todayISO(),
    phase,
    totalCalories: target.calories,
    meals
  };
}

export async function chatWithOpenRouter(message: string, phase: Phase, profile: UserProfile): Promise<string> {
  return requestText([
    {
      role: "system",
      content: "Anda adalah coach nutrisi SiklusFit untuk perempuan Indonesia. Jawab ringkas, aman, praktis, tidak menggantikan saran dokter."
    },
    {
      role: "user",
      content: `Profil: goal ${profile.goal}, preferensi ${profile.foodPreferences.join(", ") || "halal"}, alergi ${profile.allergies.join(", ") || "tidak ada"}, fase siklus ${phase}. Pertanyaan user: ${message}`
    }
  ]);
}
