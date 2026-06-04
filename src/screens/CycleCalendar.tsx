import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { CycleMiniCalendar } from "@/components/CycleMiniCalendar";
import { Screen } from "@/components/Screen";
import { StateBlock } from "@/components/StateBlock";
import { SymptomChart } from "@/components/SymptomChart";
import { useAppData } from "@/context/AppContext";
import { CycleDay, Symptom } from "@/models";
import { todayISO } from "@/utils/date";
import { getCyclePrediction } from "@/utils/phase";
import { colors, radii, shadows } from "@/theme";

const symptoms: { label: string; value: Symptom }[] = [
  ["Mood", "mood_swing"], ["Kram", "kram"], ["Payudara", "payudara_sakit"], ["Fatigue", "fatigue"], ["Craving", "craving"], ["Sleep", "sleep"],
  ["Jerawat", "jerawat"], ["Sakit kepala", "sakit_kepala"], ["Mual", "mual"], ["Kembung", "kembung"], ["Nyeri punggung", "nyeri_punggung"], ["Diare", "diare"],
  ["Konstipasi", "konstipasi"], ["Cemas", "cemas"], ["Sedih", "sedih"], ["Marah", "marah"], ["Fokus turun", "fokus_turun"], ["Energi tinggi", "energi_tinggi"],
  ["Libido tinggi", "libido_tinggi"], ["Keputihan", "keputihan"], ["Spotting", "spotting"], ["Haid deras", "haid_deras"], ["Haid ringan", "haid_ringan"], ["Pusing", "pusing"],
  ["Lapar", "lapar"], ["Haus", "haus"], ["Insomnia", "insomnia"], ["Tidur nyenyak", "tidur_nyenyak"], ["Nyeri sendi", "nyeri_sendiri"], ["Sendi pegal", "sendi_pegal"],
  ["Kulit kering", "kulit_kering"], ["Sensitif", "sensitif"]
].map(([label, value]) => ({ label, value: value as Symptom }));

export default function CycleCalendar() {
  const { profile, cycleDays, saveCycleDay } = useAppData();
  const today = todayISO();
  const existing = cycleDays.find((day) => day.date === today);
  const [selected, setSelected] = useState<Symptom[]>(existing?.symptoms ?? []);
  const [period, setPeriod] = useState<CycleDay["period"]>(existing?.period ?? "none");
  const [spotting, setSpotting] = useState(existing?.spotting ?? false);
  const [saving, setSaving] = useState(false);

  if (!profile) return <Screen title="Kalender Siklus"><StateBlock type="empty" message="Lengkapi onboarding dulu." /></Screen>;
  const prediction = getCyclePrediction(profile, cycleDays);

  function toggleSymptom(value: Symptom) {
    setSelected((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);
  }

  async function save() {
    setSaving(true);
    try {
      await saveCycleDay({ date: today, period, spotting, symptoms: selected, notes: "" });
      Alert.alert("Tersimpan", "Log siklus hari ini sudah disimpan lokal.");
    } catch {
      Alert.alert("Gagal", "Data lokal tidak dapat disimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen title="Kalender Siklus" subtitle={`Next period ${prediction.nextPeriod} - ovulasi ${prediction.ovulationDate}`}>
      <CycleMiniCalendar prediction={prediction} />
      <View style={styles.legend}>
        <Text style={styles.legendText}>M: menstruasi</Text>
        <Text style={styles.legendText}>O: ovulasi</Text>
        <Text style={styles.legendText}>F: fertile window</Text>
      </View>
      <Text style={styles.heading}>Log hari ini</Text>
      <View style={styles.chips}>
        {(["none", "start", "flow", "end"] as const).map((value) => (
          <Text key={value} onPress={() => setPeriod(value)} style={[styles.chip, period === value && styles.active]}>{value}</Text>
        ))}
        <Text onPress={() => setSpotting(!spotting)} style={[styles.chip, spotting && styles.active]}>spotting</Text>
      </View>
      <Text style={styles.heading}>Gejala</Text>
      <View style={styles.chips}>
        {symptoms.map((item) => (
          <Text key={item.value} onPress={() => toggleSymptom(item.value)} style={[styles.chip, selected.includes(item.value) && styles.active]}>{item.label}</Text>
        ))}
      </View>
      <AppButton title={saving ? "Menyimpan..." : "Simpan Log"} icon="save" onPress={save} disabled={saving} />
      <Text style={styles.heading}>History & Insight</Text>
      <SymptomChart days={cycleDays} />
      <Text style={styles.note}>{prediction.assumptions.join(" ")}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: "800", color: colors.ink },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, color: colors.ink, overflow: "hidden", fontSize: 13, ...shadows.card },
  active: { backgroundColor: colors.berry, color: colors.surface, borderColor: colors.berry },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  legendText: { color: colors.muted, fontSize: 12 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18 }
});
