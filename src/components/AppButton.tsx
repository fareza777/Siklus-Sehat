import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadows } from "@/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function AppButton({ title, onPress, variant = "primary", disabled = false, icon }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" ? styles.secondary : styles.primary,
        variant === "primary" && shadows.card,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={variant === "secondary" ? colors.berry : colors.surface} /> : null}
      <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 50, borderRadius: radii.md, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, flexDirection: "row", gap: 8 },
  primary: { backgroundColor: colors.berry },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  disabled: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.99 }] },
  text: { color: colors.surface, fontWeight: "700", fontSize: 15 },
  secondaryText: { color: colors.ink }
});
