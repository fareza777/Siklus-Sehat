import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { Screen } from "@/components/Screen";
import { StateBlock } from "@/components/StateBlock";
import { useAppData } from "@/context/AppContext";
import { chatReply } from "@/services/mockAI";
import { getCyclePrediction } from "@/utils/phase";
import { colors, radii, shadows } from "@/theme";

type Message = { role: "user" | "ai"; text: string };

export default function AIChat() {
  const { profile, cycleDays } = useAppData();
  const [input, setInput] = useState("Lagi luteal, craving manis, ada tempe dan pisang di rumah.");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!profile) return <Screen title="AI Chat"><StateBlock type="empty" message="Profil belum tersedia." /></Screen>;
  const currentProfile = profile;
  const prediction = getCyclePrediction(currentProfile, cycleDays);

  async function send() {
    if (!input.trim()) {
      setError("Tulis pertanyaan dulu.");
      return;
    }
    const text = input.trim();
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const reply = await chatReply(text, prediction.phase, currentProfile);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setError("AI chat gagal merespons.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="AI Chat" subtitle={`Konteks fase: ${prediction.phase}`}>
      <View style={styles.thread}>
        {messages.length === 0 ? <StateBlock type="empty" message="Tanyakan menu, craving, atau bahan rumah." /> : null}
        {messages.map((message, index) => (
          <View key={`${message.role}-${index}`} style={[styles.bubble, message.role === "user" ? styles.user : styles.ai]}>
            <Text style={message.role === "user" ? styles.userText : styles.aiText}>{message.text}</Text>
          </View>
        ))}
        {loading ? <StateBlock type="loading" message="Menjawab dengan mock AI lokal..." /> : null}
        {error ? <StateBlock type="error" message={error} /> : null}
      </View>
      <TextInput value={input} onChangeText={setInput} style={styles.input} multiline placeholder="Tulis kebutuhanmu..." placeholderTextColor={colors.muted} />
      <AppButton title="Kirim" icon="send" onPress={send} disabled={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  thread: { gap: 10 },
  bubble: { padding: 12, borderRadius: radii.md, maxWidth: "92%", ...shadows.card },
  user: { alignSelf: "flex-end", backgroundColor: colors.berry },
  ai: { alignSelf: "flex-start", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  userText: { color: colors.surface, lineHeight: 20 },
  aiText: { color: colors.ink, lineHeight: 20 },
  input: { minHeight: 78, textAlignVertical: "top", borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, padding: 12, color: colors.ink, backgroundColor: colors.surface }
});
