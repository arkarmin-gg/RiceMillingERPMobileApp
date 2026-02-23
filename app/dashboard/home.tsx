import {
  AppText,
  Card,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from "@/design-system/components";
import { spacing } from "@/design-system/tokens";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      router.replace("/auth/login");
    } catch {}
  }

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Card>
          <AppText variant="h1" style={{ marginBottom: spacing.s }}>
            Rice Milling ERP
          </AppText>
          <AppText variant="bodySecondary" style={{ marginBottom: spacing.l }}>
            Manage batches, inventory, and dispatches with a focused industrial
            workflow.
          </AppText>

          {isAuthenticated ? (
            <View
              style={{
                gap: spacing.s,
              }}
            >
              <AppText variant="bodySecondary">
                Signed in as {user?.email ?? "operator"}.
              </AppText>
              <SecondaryButton
                label={isLoading ? "Signing out..." : "Logout"}
                onPress={handleLogout}
              />
            </View>
          ) : (
            <PrimaryButton
              label="Go to Login"
              onPress={() => router.navigate("/auth/login")}
            />
          )}
        </Card>
      </View>
    </Screen>
  );
}
