import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme";

export function Screen({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.page, gap: spacing.gap, paddingBottom: 36 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "800", color: colors.ink },
  subtitle: { marginTop: 4, fontSize: 14, lineHeight: 20, color: colors.muted }
});
