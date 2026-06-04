import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function AppButton({ title, onPress, variant = "primary", disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed
      ]}
    >
      <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  primary: { backgroundColor: colors.berry },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  disabled: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.99 }] },
  text: { color: colors.surface, fontWeight: "700", fontSize: 15 },
  secondaryText: { color: colors.ink }
});
