import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { CycleDay } from "@/models";
import { colors } from "@/theme";

export function SymptomChart({ days }: { days: CycleDay[] }) {
  const recent = days.slice(-7);
  if (recent.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Belum ada log gejala untuk grafik.</Text>
      </View>
    );
  }

  return (
    <BarChart
      data={{
        labels: recent.map((day) => day.date.slice(5)),
        datasets: [{ data: recent.map((day) => day.symptoms.length + (day.spotting ? 1 : 0)) }]
      }}
      width={Math.min(Dimensions.get("window").width - 36, 520)}
      height={210}
      fromZero
      showValuesOnTopOfBars
      yAxisLabel=""
      yAxisSuffix=""
      chartConfig={{
        backgroundGradientFrom: colors.surface,
        backgroundGradientTo: colors.surface,
        color: () => colors.berry,
        labelColor: () => colors.muted,
        decimalPlaces: 0,
        propsForBackgroundLines: { stroke: colors.line }
      }}
      style={styles.chart}
    />
  );
}

const styles = StyleSheet.create({
  chart: { borderRadius: 8 },
  empty: { minHeight: 120, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", padding: 14 },
  emptyText: { color: colors.muted }
});
