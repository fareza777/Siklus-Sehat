import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAppData } from "@/context/AppContext";
import { colors } from "@/theme";

export default function Index() {
  const { loading, profile } = useAppData();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.canvas }}>
        <ActivityIndicator color={colors.berry} />
      </View>
    );
  }

  return <Redirect href={profile ? "/home" : "/onboarding"} />;
}
