import { Stack } from "expo-router";

export default function AppTabs() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen
        name="register"
        options={{ headerShown: true, headerTitle: "Register" }}
      />
    </Stack>
  );
}
