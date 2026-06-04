import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export function StateBlock({ type, message }: { type: "loading" | "empty" | "error"; message: string }) {
  return (
    <View style={styles.box}>
      {type === "loading" ? <ActivityIndicator color={colors.berry} /> : null}
      <Text style={[styles.text, type === "error" && styles.error]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { minHeight: 90, borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", padding: 16, gap: 8 },
  text: { color: colors.muted, textAlign: "center", lineHeight: 20 },
  error: { color: colors.error }
});
