import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii } from "@/theme";

export function StateBlock({ type, message }: { type: "loading" | "empty" | "error"; message: string }) {
  return (
    <View style={styles.box}>
      {type === "loading" ? <ActivityIndicator color={colors.berry} /> : null}
      {type === "empty" ? <Ionicons name="sparkles-outline" size={22} color={colors.coral} /> : null}
      {type === "error" ? <Ionicons name="alert-circle-outline" size={22} color={colors.error} /> : null}
      <Text style={[styles.text, type === "error" && styles.error]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { minHeight: 96, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", padding: 16, gap: 8 },
  text: { color: colors.muted, textAlign: "center", lineHeight: 20 },
  error: { color: colors.error }
});
