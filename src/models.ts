export type Goal = "turun_bb" | "maintain" | "fertility" | "pcos";
export type Phase = "menstrual" | "follicular" | "ovulation" | "luteal";

export type UserProfile = {
  id: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  averageCycleLength: number;
  lastPeriodStart: string;
  contraception: string;
  healthConditions: string[];
  foodPreferences: string[];
  allergies: string[];
  createdAt: string;
};

export type Symptom =
  | "mood_swing" | "kram" | "payudara_sakit" | "fatigue" | "craving" | "sleep"
  | "jerawat" | "sakit_kepala" | "mual" | "kembung" | "nyeri_punggung" | "diare"
  | "konstipasi" | "cemas" | "sedih" | "marah" | "fokus_turun" | "energi_tinggi"
  | "libido_tinggi" | "keputihan" | "spotting" | "haid_deras" | "haid_ringan"
  | "pusing" | "lapar" | "haus" | "insomnia" | "tidur_nyenyak" | "nyeri_sendiri"
  | "sendi_pegal" | "kulit_kering" | "sensitif";

export type CycleDay = {
  date: string;
  period: "none" | "start" | "end" | "flow";
  spotting: boolean;
  symptoms: Symptom[];
  notes: string;
};

export type FoodEntry = {
  id: string;
  date: string;
  name: string;
  imageUri?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  phaseFit: "cocok" | "kurang_cocok";
  advice: string;
  source: "scanner" | "manual";
};

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients: string[];
  phaseTags: Phase[];
  halal: boolean;
  vegetarian: boolean;
};

export type Meal = {
  title: string;
  time: "sarapan" | "makan_siang" | "makan_malam" | "snack";
  ingredients: string[];
  steps: string[];
  calories: number;
  protein: number;
  phaseReason: string;
};

export type MealPlan = {
  id: string;
  date: string;
  phase: Phase;
  totalCalories: number;
  meals: Meal[];
};

export type AppState = {
  profile: UserProfile | null;
  cycleDays: CycleDay[];
  foodEntries: FoodEntry[];
  mealPlans: MealPlan[];
};
