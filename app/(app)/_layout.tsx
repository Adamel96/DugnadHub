import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { View, Text } from "react-native";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Laster bruker...</Text>
      </View>
    );
  }

  // Ikke logget inn → gå til login-skjermen
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Logget inn → vis tabs + andre skjermer i (app)
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}
