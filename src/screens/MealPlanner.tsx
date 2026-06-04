import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { Screen } from "@/components/Screen";
import { StateBlock } from "@/components/StateBlock";
import { useAppData } from "@/context/AppContext";
import { generateMealPlan } from "@/services/mockAI";
import { getCyclePrediction } from "@/utils/phase";
import { nutritionForPhase } from "@/utils/nutrition";
import { colors } from "@/theme";
import { MealPlan as MealPlanType } from "@/models";

export default function MealPlanner() {
  const { profile, cycleDays, mealPlans, saveMealPlan } = useAppData();
  const [inventory, setInventory] = useState("tempe, bayam, ayam, pisang");
  const [plan, setPlan] = useState<MealPlanType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prediction = useMemo(() => profile ? getCyclePrediction(profile, cycleDays) : null, [profile, cycleDays]);
  if (!profile || !prediction) return <Screen title="Meal Planner"><StateBlock type="empty" message="Profil belum tersedia." /></Screen>;
  const currentProfile = profile;
  const currentPrediction = prediction;
  const target = nutritionForPhase(currentProfile, currentPrediction.phase);
  const visiblePlan = plan ?? mealPlans.find((item) => item.date === new Date().toISOString().slice(0, 10));

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const next = await generateMealPlan(currentProfile, currentPrediction.phase, inventory.split(",").map((item) => item.trim()).filter(Boolean));
      setPlan(next);
      await saveMealPlan(next);
    } catch {
      setError("Meal plan gagal dibuat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Meal Planner" subtitle={`${currentPrediction.phase} - target ${target.calories} kkal`}>
      <View style={styles.card}>
        <Text style={styles.heading}>Inventory rumah</Text>
        <TextInput value={inventory} onChangeText={setInventory} style={styles.input} placeholderTextColor={colors.muted} />
        <AppButton title={loading ? "Menyusun..." : "Generate Menu Hari Ini"} onPress={generate} disabled={loading} />
      </View>
      {loading ? <StateBlock type="loading" message="Menyusun resep 5-15 menit sesuai fase..." /> : null}
      {error ? <StateBlock type="error" message={error} /> : null}
      {visiblePlan ? (
        <View style={{ gap: 10 }}>
          {visiblePlan.meals.map((meal) => (
            <View key={`${meal.time}-${meal.title}`} style={styles.meal}>
              <Text style={styles.time}>{meal.time.replace("_", " ").toUpperCase()}</Text>
              <Text style={styles.title}>{meal.title}</Text>
              <Text style={styles.copy}>{meal.calories} kkal - protein {meal.protein}g</Text>
              <Text style={styles.copy}>{meal.phaseReason}</Text>
              <Text style={styles.copy}>Bahan: {meal.ingredients.join(", ")}</Text>
              <Text style={styles.copy}>Cara: {meal.steps.join(" ")}</Text>
            </View>
          ))}
          <AppButton title="Plan Tersimpan Lokal" onPress={() => Alert.alert("Info", "Meal plan ini sudah tersimpan lokal.")} variant="secondary" />
        </View>
      ) : !loading && !error ? <StateBlock type="empty" message="Belum ada meal plan. Generate dari inventory Anda." /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10, padding: 12, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line },
  heading: { fontSize: 17, fontWeight: "800", color: colors.ink },
  input: { minHeight: 44, borderRadius: 8, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, color: colors.ink, backgroundColor: colors.surface },
  meal: { padding: 14, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: 4 },
  time: { color: colors.berry, fontWeight: "900", fontSize: 12 },
  title: { color: colors.ink, fontWeight: "900", fontSize: 18 },
  copy: { color: colors.muted, lineHeight: 20 }
});
