import {
  AppText,
  PrimaryButton,
  Screen,
  TextField,
} from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { useAuth } from "@/hooks/use-auth";
import { useToastActions } from "@/hooks/use-toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Login() {
  const [email, setEmail] = React.useState("kaungkaung@gmail.com");
  const [password, setPassword] = React.useState("passwordD123!@#");
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const { login, isLoading, error } = useAuth();
  const { show } = useToastActions();
  const router = useRouter();

  async function handleSignIn() {
    setEmailError("");
    setPasswordError("");

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error);
      setEmailError(formattedErrors?.properties?.email?.errors[0] || "");
      setPasswordError(formattedErrors?.properties?.password?.errors[0] || "");
      return;
    }

    try {
      await login(email, password);
      show({
        type: "success",
        title: "Login Successful",
        message: "Welcome back!",
      });
      router.replace("/dashboard/home");
    } catch {
      if (error) {
        show({
          type: "error",
          title: "Login Failed",
          message: error,
        });
      }
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",

              marginBottom: spacing.l,
            }}
          >
            <View
              style={{
                height: 72,
                width: 72,
                borderRadius: 24,
                backgroundColor: "#E0ECFF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing.m,
              }}
            >
              <Ionicons
                name="construct-outline"
                size={32}
                color={colors.primary}
              />
            </View>
            <AppText variant="h1" style={{ marginBottom: spacing.xs }}>
              RiceMill ERP
            </AppText>
            <AppText variant="bodySecondary">
              Production Management System
            </AppText>
          </View>

          <View
            style={{
              marginBottom: spacing.m,
            }}
          >
            <AppText variant="h2">Sign In</AppText>
          </View>

          <View
            style={{
              marginBottom: spacing.l,
            }}
          >
            <TextField
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email.trim()}
              onChangeText={(text) => {
                setEmail(text.trim());
                setEmailError("");
              }}
              placeholder="you@example.com"
              error={emailError}
              editable={!isLoading}
              leftIcon={
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={colors.textSecondary}
                />
              }
            />
            <TextField
              label="Password"
              secureTextEntry={!showPassword}
              value={password.trim()}
              autoCapitalize="none"
              onChangeText={(text) => {
                setPassword(text.trim());
                setPasswordError("");
              }}
              placeholder="********"
              error={passwordError}
              editable={!isLoading}
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.textSecondary}
                />
              }
              rightIcon={
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.textSecondary}
                />
              }
              onRightIconPress={() => setShowPassword((prev) => !prev)}
            />
          </View>

          <View
            style={{
              gap: spacing.s,
            }}
          >
            <PrimaryButton
              label={isLoading ? "Logging in..." : "Log In"}
              rightIcon={
                !isLoading ? (
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                ) : undefined
              }
              onPress={handleSignIn}
              disabled={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
