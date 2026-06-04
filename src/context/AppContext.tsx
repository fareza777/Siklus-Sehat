import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { AppState, CycleDay, FoodEntry, MealPlan, UserProfile } from "@/models";
import { storageService } from "@/services/storage";

type AppContextValue = AppState & {
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  saveCycleDay: (day: CycleDay) => Promise<void>;
  saveFoodEntry: (entry: FoodEntry) => Promise<void>;
  saveMealPlan: (plan: MealPlan) => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>({ profile: null, cycleDays: [], foodEntries: [], mealPlans: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      setState(await storageService.load());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data lokal.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    ...state,
    loading,
    error,
    refresh,
    saveProfile: async (profile) => {
      await storageService.saveProfile(profile);
      setState((prev) => ({ ...prev, profile }));
    },
    saveCycleDay: async (day) => {
      await storageService.saveCycleDay(day);
      setState((prev) => ({ ...prev, cycleDays: [...prev.cycleDays.filter((item) => item.date !== day.date), day] }));
    },
    saveFoodEntry: async (entry) => {
      await storageService.saveFoodEntry(entry);
      setState((prev) => ({ ...prev, foodEntries: [entry, ...prev.foodEntries] }));
    },
    saveMealPlan: async (plan) => {
      await storageService.saveMealPlan(plan);
      setState((prev) => ({ ...prev, mealPlans: [plan, ...prev.mealPlans.filter((item) => item.date !== plan.date)] }));
    }
  }), [state, loading, error]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppData must be used inside AppProvider");
  return context;
}
