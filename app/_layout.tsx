import queryClient from "@/config/query-client";
import { AppText, Screen } from "@/design-system/components";
import { ToastHost } from "@/design-system/toast";
import { colors, spacing } from "@/design-system/tokens";
import { useAppState } from "@/hooks/use-app-status";
import { useAuthHydration } from "@/hooks/use-auth";
import { useLanguageStore } from "@/hooks/use-language";
import { useOnlineManager } from "@/hooks/use-online-manager";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Screen style={errorStyles.container}>
      <AppText variant="h2" style={errorStyles.title}>
        Something went wrong
      </AppText>
      <AppText variant="bodySecondary" style={errorStyles.message}>
        {error.message}
      </AppText>
      <AppText
        variant="body"
        style={errorStyles.retry}
        onPress={retry}
      >
        Try again
      </AppText>
    </Screen>
  );
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.l,
  },
  title: {
    marginBottom: spacing.s,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: spacing.l,
  },
  retry: {
    color: colors.primary,
    fontWeight: "600",
  },
});

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
