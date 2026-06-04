import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radii, spacing } from "@/theme";

export function Screen({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <Text style={styles.eyebrow}>SiklusFit</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : <Text style={styles.subtitle}>Pahami siklusmu, makan yang tepat.</Text>}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.page, gap: spacing.gap + 2, paddingBottom: 38 },
  hero: { minHeight: 124, borderRadius: radii.lg, overflow: "hidden", backgroundColor: colors.berryDark, padding: 18, justifyContent: "flex-end" },
  heroGlow: { position: "absolute", right: -36, top: -34, width: 132, height: 132, borderRadius: 66, backgroundColor: colors.coral, opacity: 0.75 },
  eyebrow: { color: colors.blush, fontSize: 12, fontWeight: "900", letterSpacing: 0, marginBottom: 6 },
  title: { fontSize: 29, lineHeight: 34, fontWeight: "900", color: colors.surface },
  subtitle: { marginTop: 6, fontSize: 14, lineHeight: 20, color: "#FFE9EE" }
});
