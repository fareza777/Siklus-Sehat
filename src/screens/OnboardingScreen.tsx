import { type ComponentProps, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { Screen } from "@/components/Screen";
import { Goal, UserProfile } from "@/models";
import { useAppData } from "@/context/AppContext";
import { colors } from "@/theme";
import { todayISO } from "@/utils/date";

const goals: { label: string; value: Goal }[] = [
  { label: "Turun BB", value: "turun_bb" },
  { label: "Maintain", value: "maintain" },
  { label: "Fertility", value: "fertility" },
  { label: "PCOS", value: "pcos" }
];

export default function OnboardingScreen() {
  const { saveProfile } = useAppData();
  const [age, setAge] = useState("28");
  const [heightCm, setHeightCm] = useState("160");
  const [weightKg, setWeightKg] = useState("58");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [averageCycleLength, setAverageCycleLength] = useState("28");
  const [lastPeriodStart, setLastPeriodStart] = useState(todayISO());
  const [contraception, setContraception] = useState("Tidak ada");
  const [healthConditions, setHealthConditions] = useState("PMS");
  const [foodPreferences, setFoodPreferences] = useState("halal");
  const [allergies, setAllergies] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    const parsedAge = Number(age);
    const parsedHeight = Number(heightCm);
    const parsedWeight = Number(weightKg);
    const parsedCycle = Number(averageCycleLength);
    if (!parsedAge || !parsedHeight || !parsedWeight || !parsedCycle || !/^\d{4}-\d{2}-\d{2}$/.test(lastPeriodStart)) {
      Alert.alert("Data belum valid", "Pastikan angka dan tanggal memakai format YYYY-MM-DD.");
      return;
    }
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      age: parsedAge,
      heightCm: parsedHeight,
      weightKg: parsedWeight,
      goal,
      averageCycleLength: Math.min(45, Math.max(21, parsedCycle)),
      lastPeriodStart,
      contraception,
      healthConditions: healthConditions.split(",").map((item) => item.trim()).filter(Boolean),
      foodPreferences: foodPreferences.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean),
      allergies: allergies.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean),
      createdAt: new Date().toISOString()
    };
    setSaving(true);
    try {
      await saveProfile(profile);
      router.replace("/home");
    } catch {
      Alert.alert("Gagal menyimpan", "Coba lagi. Data hanya disimpan di perangkat.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen title="SiklusFit" subtitle="Pahami siklusmu, makan yang tepat, rasakan bedanya.">
        <View style={styles.card}>
          <View style={styles.row}>
            <Field label="Usia" value={age} onChangeText={setAge} keyboardType="numeric" />
            <Field label="Tinggi cm" value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" />
            <Field label="Berat kg" value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" />
          </View>
          <Text style={styles.label}>Goal</Text>
          <View style={styles.chips}>
            {goals.map((item) => (
              <Text key={item.value} onPress={() => setGoal(item.value)} style={[styles.chip, goal === item.value && styles.chipActive]}>
                {item.label}
              </Text>
            ))}
          </View>
          <Field label="Rata-rata panjang siklus" value={averageCycleLength} onChangeText={setAverageCycleLength} keyboardType="numeric" />
          <Field label="Tanggal menstruasi terakhir (YYYY-MM-DD)" value={lastPeriodStart} onChangeText={setLastPeriodStart} />
          <Field label="Kontrasepsi" value={contraception} onChangeText={setContraception} />
          <Field label="Kondisi kesehatan (pisahkan koma)" value={healthConditions} onChangeText={setHealthConditions} />
          <Field label="Preferensi makanan" value={foodPreferences} onChangeText={setFoodPreferences} />
          <Field label="Alergi" value={allergies} onChangeText={setAllergies} placeholder="contoh: seafood, kacang" />
        </View>
        <AppButton title={saving ? "Menyimpan..." : "Mulai Tracking"} onPress={submit} disabled={saving} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

function Field({ label, ...props }: { label: string } & ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={styles.input} placeholderTextColor={colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 12 },
  row: { flexDirection: "row", gap: 8 },
  field: { flex: 1, gap: 6 },
  label: { fontSize: 12, fontWeight: "800", color: colors.muted },
  input: { minHeight: 44, borderRadius: 8, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, color: colors.ink, backgroundColor: "#FFFCFA" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 8, borderWidth: 1, borderColor: colors.line, color: colors.ink, overflow: "hidden" },
  chipActive: { backgroundColor: colors.berry, color: colors.surface, borderColor: colors.berry }
});
