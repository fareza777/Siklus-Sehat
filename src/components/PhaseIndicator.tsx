import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Phase } from "@/models";
import { phaseInsight, phaseLabel } from "@/utils/phase";
import { colors, radii, shadows } from "@/theme";

const phaseColors: Record<Phase, string> = {
  menstrual: colors.berry,
  follicular: colors.leaf,
  ovulation: colors.gold,
  luteal: colors.coral
};

export function PhaseIndicator({ phase, cycleDay }: { phase: Phase; cycleDay: number }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: phaseColors[phase] }]}>
        <Ionicons name={phase === "luteal" ? "moon" : phase === "ovulation" ? "flower" : phase === "follicular" ? "leaf" : "water"} size={18} color={colors.surface} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Hari ke-{cycleDay} {phaseLabel(phase)}</Text>
        <Text style={styles.copy}>{phaseInsight(phase)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", gap: 12, alignItems: "center", padding: 15, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, ...shadows.card },
  iconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  label: { color: colors.ink, fontWeight: "800", fontSize: 16 },
  copy: { marginTop: 4, color: colors.muted, lineHeight: 19 }
});
