import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AppButton } from "@/components/AppButton";
import { FoodCard } from "@/components/FoodCard";
import { Screen } from "@/components/Screen";
import { StateBlock } from "@/components/StateBlock";
import { useAppData } from "@/context/AppContext";
import { analyzeFoodImage } from "@/services/mockAI";
import { getCyclePrediction } from "@/utils/phase";
import { colors, radii, shadows } from "@/theme";
import { FoodEntry } from "@/models";

export default function FoodScanner() {
  const { profile, cycleDays, saveFoodEntry } = useAppData();
  const [imageUri, setImageUri] = useState("");
  const [hint, setHint] = useState("");
  const [entry, setEntry] = useState<FoodEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!profile) return <Screen title="AI Food Scanner"><StateBlock type="empty" message="Profil belum tersedia." /></Screen>;
  const prediction = getCyclePrediction(profile, cycleDays);

  async function pickImage() {
    setError("");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Izin galeri ditolak. Aktifkan izin foto untuk memakai scanner.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3]
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setEntry(null);
    }
  }

  async function analyze() {
    if (!imageUri) {
      setError("Pilih foto makanan terlebih dahulu.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await analyzeFoodImage(imageUri, prediction.phase, hint);
      setEntry(result);
    } catch {
      setError("Analisis gagal. Mock AI tidak dapat membaca foto ini.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!entry) return;
    await saveFoodEntry(entry);
    Alert.alert("Tersimpan", "Food entry masuk ke dashboard dan storage lokal.");
  }

  return (
    <Screen title="AI Food Scanner" subtitle={`Fase saat ini: ${prediction.phase}`}>
      <View style={styles.panel}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <StateBlock type="empty" message="Belum ada foto. Pilih foto makanan Indonesia dari galeri." />}
        <TextInput value={hint} onChangeText={setHint} placeholder="Hint opsional: sate ayam, gado-gado..." placeholderTextColor={colors.muted} style={styles.input} />
        <View style={styles.row}>
          <AppButton title="Pilih Foto" icon="image" onPress={pickImage} variant="secondary" />
          <AppButton title={loading ? "Analisis..." : "Analisis"} icon="sparkles" onPress={analyze} disabled={loading} />
        </View>
      </View>
      {loading ? <StateBlock type="loading" message="Mock Gemini/Claude Vision sedang mengestimasi nutrisi..." /> : null}
      {error ? <StateBlock type="error" message={error} /> : null}
      {entry ? (
        <>
          <FoodCard item={entry} />
          <TextInput
            value={entry.name}
            onChangeText={(name) => setEntry({ ...entry, name })}
            style={styles.input}
            placeholder="Edit nama makanan"
          />
          <View style={styles.macroRow}>
            {(["calories", "protein", "carbs", "fat"] as const).map((key) => (
              <TextInput
                key={key}
                value={String(entry[key])}
                onChangeText={(value) => setEntry({ ...entry, [key]: Number(value) || 0 })}
                keyboardType="numeric"
                style={[styles.input, styles.macro]}
                placeholder={key}
              />
            ))}
          </View>
          <AppButton title="Simpan Entry" icon="checkmark-circle" onPress={save} />
        </>
      ) : !loading && !error ? <StateBlock type="empty" message="Hasil analisis akan tampil di sini." /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 10, padding: 12, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.line, ...shadows.card },
  image: { width: "100%", aspectRatio: 4 / 3, borderRadius: radii.md, backgroundColor: colors.line },
  row: { flexDirection: "row", gap: 10 },
  input: { minHeight: 46, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, color: colors.ink, backgroundColor: colors.surface },
  macroRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  macro: { flexGrow: 1, minWidth: "45%" }
});
