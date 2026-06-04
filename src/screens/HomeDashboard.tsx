import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { FoodCard } from "@/components/FoodCard";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { Screen } from "@/components/Screen";
import { StateBlock } from "@/components/StateBlock";
import { useAppData } from "@/context/AppContext";
import { getCyclePrediction } from "@/utils/phase";
import { nutritionForPhase } from "@/utils/nutrition";
import { colors } from "@/theme";
import { todayISO } from "@/utils/date";

export default function HomeDashboard() {
  const app = useAppData();
  if (app.error) return <Screen title="SiklusFit"><StateBlock type="error" message={app.error} /></Screen>;
  if (!app.profile) return <Screen title="SiklusFit"><StateBlock type="empty" message="Profil belum dibuat." /><AppButton title="Isi onboarding" onPress={() => router.replace("/onboarding")} /></Screen>;

  const prediction = getCyclePrediction(app.profile, app.cycleDays);
  const target = nutritionForPhase(app.profile, prediction.phase);
  const todayFoods = app.foodEntries.filter((entry) => entry.date === todayISO());
  const calories = todayFoods.reduce((sum, entry) => sum + entry.calories, 0);
  const pct = Math.min(1, calories / target.calories);
  const todaysCycle = app.cycleDays.find((day) => day.date === todayISO());

  return (
    <Screen title="SiklusFit" subtitle="Dashboard mobile harian">
      <PhaseIndicator phase={prediction.phase} cycleDay={prediction.cycleDay} />
      <View style={styles.calorieCard}>
        <View style={styles.ring}>
          <Text style={styles.big}>{Math.round(pct * 100)}%</Text>
          <Text style={styles.small}>{calories}/{target.calories} kkal</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Target nutrisi fase ini</Text>
          <Text style={styles.copy}>Protein {target.protein}g - Karbo {target.carbs}g - Lemak {target.fat}g</Text>
          <Text style={styles.copy}>{target.guidance}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <AppButton title="Log Gejala" onPress={() => router.push("/cycle")} />
        <AppButton title="Foto Makanan" onPress={() => router.push("/scanner")} variant="secondary" />
      </View>
      <View style={styles.nav}>
        <Link href="/planner" style={styles.link}>Meal Planner</Link>
        <Link href="/chat" style={styles.link}>AI Chat</Link>
        <Link href="/cycle" style={styles.link}>Kalender</Link>
      </View>
      <Text style={styles.heading}>Ringkasan hari ini</Text>
      {todaysCycle ? <Text style={styles.copy}>Gejala: {todaysCycle.symptoms.join(", ") || "Tidak ada"} {todaysCycle.spotting ? "- spotting" : ""}</Text> : <StateBlock type="empty" message="Belum ada gejala hari ini." />}
      <Text style={styles.heading}>Makanan terakhir</Text>
      {todayFoods[0] ? <FoodCard item={todayFoods[0]} /> : <StateBlock type="empty" message="Belum ada makanan tercatat hari ini." />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  calorieCard: { flexDirection: "row", gap: 14, alignItems: "center", backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line, padding: 14 },
  ring: { width: 104, height: 104, borderRadius: 52, borderWidth: 10, borderColor: colors.berry, alignItems: "center", justifyContent: "center" },
  big: { fontSize: 24, fontWeight: "900", color: colors.ink },
  small: { fontSize: 11, color: colors.muted, marginTop: 2 },
  heading: { fontSize: 17, fontWeight: "800", color: colors.ink },
  copy: { color: colors.muted, lineHeight: 20, marginTop: 4 },
  actions: { flexDirection: "row", gap: 10 },
  nav: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  link: { color: colors.berry, fontWeight: "800", padding: 8, backgroundColor: colors.surface, borderRadius: 8, overflow: "hidden" }
});
