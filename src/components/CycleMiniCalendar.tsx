import { StyleSheet, Text, View } from "react-native";
import { CyclePrediction } from "@/utils/phase";
import { addDays, todayISO } from "@/utils/date";
import { colors } from "@/theme";

export function CycleMiniCalendar({ prediction }: { prediction: CyclePrediction }) {
  const start = todayISO();
  const days = Array.from({ length: 21 }, (_, index) => addDays(start, index));
  return (
    <View style={styles.grid}>
      {days.map((day) => {
        const marker = day === prediction.nextPeriod ? "M" : day === prediction.ovulationDate ? "O" : prediction.fertileWindow.includes(day) ? "F" : "";
        return (
          <View key={day} style={[styles.cell, marker === "M" && styles.period, marker === "O" && styles.ovulation, marker === "F" && styles.fertile]}>
            <Text style={styles.date}>{day.slice(8)}</Text>
            <Text style={styles.marker}>{marker}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  cell: { width: "13.2%", minHeight: 48, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  date: { fontWeight: "700", color: colors.ink },
  marker: { marginTop: 2, fontSize: 11, color: colors.muted, fontWeight: "800" },
  period: { backgroundColor: "#FBE7EF", borderColor: colors.berry },
  ovulation: { backgroundColor: "#FFF1D4", borderColor: colors.gold },
  fertile: { backgroundColor: "#E8F4FF", borderColor: colors.blue }
});
