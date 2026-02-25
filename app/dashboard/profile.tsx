import { AppText, DangerButton, Screen } from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <Screen style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, marginTop: 100 }}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  user?.profile_image_url ??
                  require("../../assets/images/react-logo.png")
                } // Placeholder, replace with user avatar if available
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#FFFFFF" />
              </View>
            </View>

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
                {user?.user_type}
              </AppText>
            </View>

            <AppText variant="bodySecondary" style={styles.contactInfo}>
              {user?.email || "---"}
            </AppText>
            <AppText variant="bodySecondary" style={styles.contactInfo}>
              {user?.phone || "---"}
            </AppText>
          </View>
        </View>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
  },
  headerTitle: {
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
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
  contactInfo: {
    marginBottom: 2,
  },
  sectionHeader: {
    marginBottom: spacing.s,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.m,
  },
  menuItemPressed: {
    backgroundColor: colors.background,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.m,
  },
  menuItemText: {
    fontWeight: "500",
  },
  versionText: {
    textAlign: "center",
    color: colors.textSecondary,
    opacity: 0.6,
  },
});
