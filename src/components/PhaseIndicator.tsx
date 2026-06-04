import { StyleSheet, Text, View } from "react-native";
import { Phase } from "@/models";
import { phaseInsight, phaseLabel } from "@/utils/phase";
import { colors } from "@/theme";

const phaseColors: Record<Phase, string> = {
  menstrual: colors.berry,
  follicular: colors.leaf,
  ovulation: colors.gold,
  luteal: colors.coral
};

export function PhaseIndicator({ phase, cycleDay }: { phase: Phase; cycleDay: number }) {
  return (
    <View style={styles.card}>
      <View style={[styles.dot, { backgroundColor: phaseColors[phase] }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Hari ke-{cycleDay} {phaseLabel(phase)}</Text>
        <Text style={styles.copy}>{phaseInsight(phase)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", gap: 12, alignItems: "center", padding: 14, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  dot: { width: 14, height: 14, borderRadius: 7 },
  label: { color: colors.ink, fontWeight: "800", fontSize: 16 },
  copy: { marginTop: 4, color: colors.muted, lineHeight: 19 }
});
