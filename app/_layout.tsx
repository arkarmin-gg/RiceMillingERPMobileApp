import queryClient from "@/config/query-client";
import { AppText, Screen } from "@/design-system/components";
import { ToastHost } from "@/design-system/toast";
import { colors, spacing } from "@/design-system/tokens";
import { useAppState } from "@/hooks/use-app-status";
import { useAuth, useAuthHydration } from "@/hooks/use-auth";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  useOnlineManager();
  useAppState();
  const { isLoading } = useAuth();
  const hasHydrated = useAuthHydration();

  const showAuthLoading = !hasHydrated || isLoading;

  return (
    <QueryClientProvider client={queryClient}>
      {showAuthLoading ? (
        <Screen>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText
              variant="bodySecondary"
              style={{ marginTop: spacing.m, color: colors.textSecondary }}
            >
              Checking your session...
            </AppText>
          </View>
        </Screen>
      ) : (
        <>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                color: "#FFFFFF",
                fontSize: 20,
                fontWeight: "600",
              },
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          </Stack>
          <ToastHost />
        </>
      )}
    </QueryClientProvider>
  );
}
