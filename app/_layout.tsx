import queryClient from "@/config/query-client";
import { AppText, Screen } from "@/design-system/components";
import { ToastHost } from "@/design-system/toast";
import { colors, spacing } from "@/design-system/tokens";
import { useAppState } from "@/hooks/use-app-status";
import { useAuthHydration } from "@/hooks/use-auth";
import { useLanguageStore } from "@/hooks/use-language";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  useOnlineManager();
  useAppState();
  const hasHydrated = useAuthHydration();
  const locale = useLanguageStore((state) => state.locale);

  const showAuthLoading = !hasHydrated;

  return (
    <QueryClientProvider client={queryClient} key={locale}>
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
              statusBarStyle: "dark",
            }}
          >
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          </Stack>
          <ToastHost />
        </>
      )}
    </QueryClientProvider>
  );
}
