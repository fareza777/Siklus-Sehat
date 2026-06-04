import { FoodItem, Phase } from "@/models";

const phase = {
  menstrual: "menstrual",
  follicular: "follicular",
  ovulation: "ovulation",
  luteal: "luteal"
} satisfies Record<Phase, Phase>;

export const foodDatabase: FoodItem[] = [
  { id: "nasi-padang-sehat", name: "Nasi Padang Rendang Sehat", category: "utama", calories: 620, protein: 32, carbs: 68, fat: 24, micronutrients: ["zat besi", "protein"], phaseTags: [phase.menstrual, phase.follicular], halal: true, vegetarian: false },
  { id: "gado-gado", name: "Gado-gado Lontong", category: "utama", calories: 480, protein: 18, carbs: 55, fat: 20, micronutrients: ["magnesium", "serat"], phaseTags: [phase.luteal, phase.follicular], halal: true, vegetarian: true },
  { id: "sate-ayam", name: "Sate Ayam Bumbu Kacang", category: "utama", calories: 520, protein: 36, carbs: 36, fat: 24, micronutrients: ["protein", "zinc"], phaseTags: [phase.follicular, phase.ovulation], halal: true, vegetarian: false },
  { id: "soto-ayam", name: "Soto Ayam Bening", category: "utama", calories: 390, protein: 28, carbs: 42, fat: 12, micronutrients: ["protein", "selenium"], phaseTags: [phase.follicular], halal: true, vegetarian: false },
  { id: "pecel-madiun", name: "Pecel Madiun", category: "utama", calories: 430, protein: 16, carbs: 58, fat: 15, micronutrients: ["magnesium", "folat"], phaseTags: [phase.menstrual, phase.luteal], halal: true, vegetarian: true },
  { id: "tempe-orek", name: "Tempe Orek", category: "lauk", calories: 260, protein: 16, carbs: 18, fat: 14, micronutrients: ["magnesium", "protein"], phaseTags: [phase.luteal, phase.follicular], halal: true, vegetarian: true },
  { id: "ayam-bakar", name: "Ayam Bakar Taliwang Ringan", category: "lauk", calories: 340, protein: 38, carbs: 8, fat: 16, micronutrients: ["protein", "B6"], phaseTags: [phase.follicular], halal: true, vegetarian: false },
  { id: "ikan-pepes", name: "Pepes Ikan", category: "lauk", calories: 280, protein: 34, carbs: 6, fat: 12, micronutrients: ["omega-3", "zinc"], phaseTags: [phase.ovulation, phase.follicular], halal: true, vegetarian: false },
  { id: "sayur-bayam", name: "Sayur Bayam Jagung", category: "sayur", calories: 150, protein: 7, carbs: 24, fat: 3, micronutrients: ["zat besi", "Vitamin C"], phaseTags: [phase.menstrual], halal: true, vegetarian: true },
  { id: "sup-kacang-merah", name: "Sup Kacang Merah", category: "sayur", calories: 310, protein: 18, carbs: 44, fat: 7, micronutrients: ["zat besi", "serat"], phaseTags: [phase.menstrual, phase.luteal], halal: true, vegetarian: true },
  { id: "nasi-merah", name: "Nasi Merah", category: "karbo", calories: 215, protein: 5, carbs: 45, fat: 2, micronutrients: ["serat", "mangan"], phaseTags: [phase.follicular, phase.luteal], halal: true, vegetarian: true },
  { id: "ubi-rebus", name: "Ubi Rebus", category: "karbo", calories: 180, protein: 3, carbs: 41, fat: 0, micronutrients: ["karbo kompleks", "kalium"], phaseTags: [phase.luteal], halal: true, vegetarian: true },
  { id: "bubur-manado", name: "Bubur Manado", category: "utama", calories: 360, protein: 14, carbs: 62, fat: 8, micronutrients: ["folat", "serat"], phaseTags: [phase.menstrual, phase.follicular], halal: true, vegetarian: true },
  { id: "urap-sayur", name: "Urap Sayur", category: "sayur", calories: 220, protein: 8, carbs: 22, fat: 11, micronutrients: ["magnesium", "folat"], phaseTags: [phase.luteal, phase.menstrual], halal: true, vegetarian: true },
  { id: "telur-balado", name: "Telur Balado", category: "lauk", calories: 250, protein: 14, carbs: 10, fat: 17, micronutrients: ["kolin", "protein"], phaseTags: [phase.follicular], halal: true, vegetarian: true },
  { id: "tahu-gejrot", name: "Tahu Gejrot", category: "snack", calories: 230, protein: 13, carbs: 18, fat: 12, micronutrients: ["protein nabati"], phaseTags: [phase.luteal], halal: true, vegetarian: true },
  { id: "rujak-buah", name: "Rujak Buah", category: "snack", calories: 190, protein: 2, carbs: 44, fat: 1, micronutrients: ["Vitamin C", "antioksidan"], phaseTags: [phase.ovulation, phase.menstrual], halal: true, vegetarian: true },
  { id: "jambu-biji", name: "Jambu Biji Merah", category: "buah", calories: 110, protein: 4, carbs: 24, fat: 1, micronutrients: ["Vitamin C", "antioksidan"], phaseTags: [phase.ovulation, phase.menstrual], halal: true, vegetarian: true },
  { id: "pisang", name: "Pisang", category: "buah", calories: 105, protein: 1, carbs: 27, fat: 0, micronutrients: ["magnesium", "kalium"], phaseTags: [phase.luteal], halal: true, vegetarian: true },
  { id: "edamame", name: "Edamame Rebus", category: "snack", calories: 190, protein: 17, carbs: 15, fat: 8, micronutrients: ["protein", "folat"], phaseTags: [phase.follicular, phase.menstrual], halal: true, vegetarian: true },
  { id: "kacang-mete", name: "Kacang Mete Panggang", category: "snack", calories: 170, protein: 5, carbs: 9, fat: 14, micronutrients: ["magnesium", "zinc"], phaseTags: [phase.luteal, phase.ovulation], halal: true, vegetarian: true },
  { id: "cokelat-hitam", name: "Cokelat Hitam 70%", category: "snack", calories: 160, protein: 2, carbs: 14, fat: 11, micronutrients: ["magnesium"], phaseTags: [phase.luteal], halal: true, vegetarian: true },
  { id: "seafood-kuah", name: "Seafood Kuah Asam", category: "utama", calories: 360, protein: 35, carbs: 20, fat: 14, micronutrients: ["zinc", "omega-3"], phaseTags: [phase.ovulation], halal: true, vegetarian: false },
  { id: "labu-kukus", name: "Labu Kuning Kukus", category: "karbo", calories: 120, protein: 3, carbs: 28, fat: 0, micronutrients: ["antioksidan", "karotenoid"], phaseTags: [phase.ovulation], halal: true, vegetarian: true },
  { id: "ayam-kecap", name: "Ayam Kecap Jahe", category: "lauk", calories: 330, protein: 32, carbs: 18, fat: 14, micronutrients: ["protein"], phaseTags: [phase.follicular], halal: true, vegetarian: false },
  { id: "capcay", name: "Capcay Kuah", category: "sayur", calories: 240, protein: 12, carbs: 30, fat: 7, micronutrients: ["Vitamin C", "serat"], phaseTags: [phase.follicular, phase.ovulation], halal: true, vegetarian: true },
  { id: "rendang-tempe", name: "Rendang Tempe", category: "lauk", calories: 310, protein: 18, carbs: 20, fat: 18, micronutrients: ["magnesium", "protein"], phaseTags: [phase.luteal], halal: true, vegetarian: true },
  { id: "ikan-kembung", name: "Ikan Kembung Bakar", category: "lauk", calories: 300, protein: 33, carbs: 2, fat: 17, micronutrients: ["omega-3", "zinc"], phaseTags: [phase.ovulation, phase.follicular], halal: true, vegetarian: false },
  { id: "lotek", name: "Lotek Sayur", category: "utama", calories: 450, protein: 15, carbs: 56, fat: 18, micronutrients: ["serat", "magnesium"], phaseTags: [phase.luteal], halal: true, vegetarian: true },
  { id: "nasi-uduk", name: "Nasi Uduk Porsi Ringan", category: "utama", calories: 540, protein: 18, carbs: 70, fat: 21, micronutrients: ["energi"], phaseTags: [phase.follicular], halal: true, vegetarian: false },
  { id: "bakso-kuah", name: "Bakso Kuah Tanpa Mie", category: "utama", calories: 360, protein: 24, carbs: 24, fat: 17, micronutrients: ["protein", "zat besi"], phaseTags: [phase.menstrual], halal: true, vegetarian: false },
  { id: "smoothie-alpukat", name: "Smoothie Alpukat Tanpa Gula", category: "snack", calories: 260, protein: 5, carbs: 18, fat: 20, micronutrients: ["magnesium", "lemak baik"], phaseTags: [phase.luteal], halal: true, vegetarian: true }
];

export function foodsForPhase(currentPhase: Phase, vegetarianOnly = false): FoodItem[] {
  return foodDatabase.filter((food) => food.phaseTags.includes(currentPhase) && (!vegetarianOnly || food.vegetarian));
}
