import { Stack } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loadingScreen";
export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkToken = async () => {
      await hydrate();
      setLoading(false);
    };
    checkToken();
  }, []);
  if (loading) return <LoadingScreen />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="(public)" />
      </Stack.Protected>
    </Stack>
  );
}
