import { AppText } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

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
        Quick Actions
      </AppText>
      <View style={styles.actionsRow}>
        <ActionButton
          icon={<Ionicons name="add" size={24} color={colors.surface} />}
          label="New Batch"
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
          label="Dispatch"
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
          label="Check Stock"
          onPress={() => {
            // Navigate to home to show stock (already on home, maybe scroll to top?)
            // For now, let's just push to home which effectively refreshes/resets
            router.push("/dashboard/home");
          }}
        />
      </View>
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
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.m,
  },
  actionButton: {
    flex: 1,
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
