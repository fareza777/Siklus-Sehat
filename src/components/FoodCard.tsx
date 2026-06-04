import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FoodEntry, FoodItem } from "@/models";
import { colors, radii, shadows } from "@/theme";

export function FoodCard({ item }: { item: FoodEntry | FoodItem }) {
  const phaseFit = "phaseFit" in item ? item.phaseFit : undefined;
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name="restaurant" size={18} color={colors.berry} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.meta}>{item.calories} kkal - P {item.protein}g - K {item.carbs}g - L {item.fat}g</Text>
        {"advice" in item ? <Text style={styles.advice}>{item.advice}</Text> : null}
      </View>
      {phaseFit ? <Text style={[styles.badge, phaseFit === "cocok" ? styles.fit : styles.unfit]}>{phaseFit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", gap: 10, padding: 14, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, ...shadows.card },
  icon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.blush },
  title: { fontSize: 16, fontWeight: "800", color: colors.ink },
  meta: { marginTop: 4, color: colors.muted },
  advice: { marginTop: 8, color: colors.ink, lineHeight: 19 },
  badge: { alignSelf: "flex-start", overflow: "hidden", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, fontWeight: "700", fontSize: 12 },
  fit: { backgroundColor: "#E3F3ED", color: colors.leaf },
  unfit: { backgroundColor: "#FCE8E3", color: colors.error }
});
