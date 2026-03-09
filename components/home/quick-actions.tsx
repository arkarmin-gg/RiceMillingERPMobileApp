import i18n from "@/config/i18n";
import { AppText } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

function ActionButton({ icon, label, onPress }: ActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        pressed && styles.actionButtonPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <AppText variant="body" style={styles.actionLabel}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppText variant="caption" style={styles.sectionTitle}>
        {i18n.t("quick_actions")}
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsScroll}
      >
        <ActionButton
          icon={<Ionicons name="add" size={24} color={colors.surface} />}
          label={i18n.t("new_batch")}
          onPress={() => router.push("/dashboard/production-batch/create")}
        />
        <ActionButton
          icon={
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={24}
              color={colors.surface}
            />
          }
          label={i18n.t("dispatch")}
          onPress={() => router.push("/dashboard/dispatches/create")}
        />
        <ActionButton
          icon={
            <Ionicons
              name="clipboard-outline"
              size={24}
              color={colors.surface}
            />
          }
          label={i18n.t("check_stock")}
          onPress={() => {
            router.push("/dashboard/check-stock");
          }}
        />
        <ActionButton
          icon={
            <Ionicons name="time-outline" size={24} color={colors.surface} />
          }
          label={i18n.t("activity_log")}
          onPress={() => router.push("/dashboard/activity-log")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.m,
    color: colors.textSecondary,
  },
  actionsScroll: {
    gap: spacing.m,
  },
  actionButton: {
    width: 120, // Fixed width for horizontal items
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    minHeight: 100,
  },
  actionButtonPressed: {
    opacity: 0.7,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.s,
  },
  actionLabel: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 14,
  },
});
