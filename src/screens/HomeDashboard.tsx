import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppButton } from "@/components/AppButton";
import { FoodCard } from "@/components/FoodCard";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { Screen } from "@/components/Screen";
import { StateBlock } from "@/components/StateBlock";
import { useAppData } from "@/context/AppContext";
import { getCyclePrediction } from "@/utils/phase";
import { nutritionForPhase } from "@/utils/nutrition";
import { colors, radii, shadows } from "@/theme";
import { todayISO } from "@/utils/date";

export default function HomeDashboard() {
  const app = useAppData();
  if (app.error) return <Screen title="Siklus Sehat"><StateBlock type="error" message={app.error} /></Screen>;
  if (!app.profile) return <Screen title="Siklus Sehat"><StateBlock type="empty" message="Profil belum dibuat." /><AppButton title="Isi onboarding" onPress={() => router.replace("/onboarding")} /></Screen>;

  const prediction = getCyclePrediction(app.profile, app.cycleDays);
  const target = nutritionForPhase(app.profile, prediction.phase);
  const todayFoods = app.foodEntries.filter((entry) => entry.date === todayISO());
  const calories = todayFoods.reduce((sum, entry) => sum + entry.calories, 0);
  const pct = Math.min(1, calories / target.calories);
  const todaysCycle = app.cycleDays.find((day) => day.date === todayISO());

  return (
    <Screen title="Siklus Sehat" subtitle="Dashboard mobile harian">
      <PhaseIndicator phase={prediction.phase} cycleDay={prediction.cycleDay} />
      <View style={styles.calorieCard}>
        <View style={[styles.ring, { borderColor: pct > 0.8 ? colors.leaf : colors.berry }]}>
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
        <AppButton title="Log Gejala" icon="pulse" onPress={() => router.push("/cycle")} />
        <AppButton title="Foto Makanan" icon="camera" onPress={() => router.push("/scanner")} variant="secondary" />
      </View>
      <View style={styles.nav}>
        <QuickLink href="/planner" icon="nutrition" label="Meal" />
        <QuickLink href="/chat" icon="chatbubble-ellipses" label="AI Chat" />
        <QuickLink href="/cycle" icon="calendar" label="Kalender" />
      </View>
      <Text style={styles.heading}>Ringkasan hari ini</Text>
      {todaysCycle ? <Text style={styles.copy}>Gejala: {todaysCycle.symptoms.join(", ") || "Tidak ada"} {todaysCycle.spotting ? "- spotting" : ""}</Text> : <StateBlock type="empty" message="Belum ada gejala hari ini." />}
      <Text style={styles.heading}>Makanan terakhir</Text>
      {todayFoods[0] ? <FoodCard item={todayFoods[0]} /> : <StateBlock type="empty" message="Belum ada makanan tercatat hari ini." />}
    </Screen>
  );
}

function QuickLink({ href, icon, label }: { href: "/planner" | "/chat" | "/cycle"; icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Link href={href} style={styles.link}>
      <View style={styles.linkInner}>
        <Ionicons name={icon} size={18} color={colors.berry} />
        <Text style={styles.linkText}>{label}</Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  calorieCard: { flexDirection: "row", gap: 14, alignItems: "center", backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.line, padding: 15, ...shadows.card },
  ring: { width: 108, height: 108, borderRadius: 54, borderWidth: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceSoft },
  big: { fontSize: 24, fontWeight: "900", color: colors.ink },
  small: { fontSize: 11, color: colors.muted, marginTop: 2 },
  heading: { fontSize: 17, fontWeight: "800", color: colors.ink },
  copy: { color: colors.muted, lineHeight: 20, marginTop: 4 },
  actions: { flexDirection: "row", gap: 10 },
  nav: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  link: { flexGrow: 1, minWidth: "30%", backgroundColor: colors.surface, borderRadius: radii.md, overflow: "hidden", borderWidth: 1, borderColor: colors.line },
  linkInner: { minHeight: 54, alignItems: "center", justifyContent: "center", gap: 4 },
  linkText: { color: colors.ink, fontWeight: "800", fontSize: 12 }
});
