import InfoRow from "@/components/ui/info-row";
import { AppText, DangerButton, Screen } from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <Screen style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.profileSection}>
          <Pressable
            onPress={() => router.push("/dashboard/profile/edit")}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={
                  user?.profile_image_url ??
                  require("../../../assets/images/react-logo.png")
                }
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>

          <AppText variant="h1" style={styles.name}>
            {user?.full_name || "John Doe"}
          </AppText>

          <View style={styles.roleBadge}>
            <Ionicons
              name="shield-checkmark"
              size={12}
              color={colors.primary}
              style={{ marginRight: 4 }}
            />
            <AppText
              variant="caption"
              style={{ color: colors.primary, fontWeight: "700" }}
            >
              {String(user?.user_type || "")}
            </AppText>
          </View>

          {/* <AppText variant="bodySecondary" style={styles.contactInfo}>
            {user?.email || "---"}
          </AppText> */}

          <View style={styles.infoSection}>
            <InfoRow
              icon="call-outline"
              label="Phone"
              value={user?.phone || "---"}
            />
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={user?.email || "---"}
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <DangerButton
          onPress={handleLogout}
          label="Logout"
          rightIcon={
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.background}
            />
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.m,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  name: {
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE", // Light blue
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginBottom: spacing.m,
  },
  infoSection: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    gap: spacing.m,
  },
});
