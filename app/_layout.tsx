import { Slot, useSegments, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";

function AuthGate() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // vent på Firebase

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      router.replace("/auth/login");
    }

    if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, loading]);

  if (loading) {
    return null; // eller en spinner hvis du vil
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
