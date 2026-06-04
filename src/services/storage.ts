import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, CycleDay, FoodEntry, MealPlan, UserProfile } from "@/models";

const KEY = "siklusfit:v1";

const emptyState: AppState = {
  profile: null,
  cycleDays: [],
  foodEntries: [],
  mealPlans: []
};

async function readState(): Promise<AppState> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return emptyState;
  const parsed = JSON.parse(raw) as Partial<AppState>;
  return {
    profile: parsed.profile ?? null,
    cycleDays: parsed.cycleDays ?? [],
    foodEntries: parsed.foodEntries ?? [],
    mealPlans: parsed.mealPlans ?? []
  };
}

async function writeState(next: AppState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export const storageService = {
  load: readState,
  saveProfile: async (profile: UserProfile) => {
    const state = await readState();
    await writeState({ ...state, profile });
  },
  saveCycleDay: async (day: CycleDay) => {
    const state = await readState();
    const cycleDays = [...state.cycleDays.filter((item) => item.date !== day.date), day].sort((a, b) => a.date.localeCompare(b.date));
    await writeState({ ...state, cycleDays });
  },
  saveFoodEntry: async (entry: FoodEntry) => {
    const state = await readState();
    await writeState({ ...state, foodEntries: [entry, ...state.foodEntries].slice(0, 120) });
  },
  saveMealPlan: async (plan: MealPlan) => {
    const state = await readState();
    const mealPlans = [plan, ...state.mealPlans.filter((item) => item.date !== plan.date)].slice(0, 45);
    await writeState({ ...state, mealPlans });
  },
  clear: async () => AsyncStorage.removeItem(KEY)
};
