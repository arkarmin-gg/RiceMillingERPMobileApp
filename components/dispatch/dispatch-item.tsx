import { AppText } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { Dispatch } from "@/types/dispatch";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface DispatchItemProps {
  dispatch: Dispatch;
  onPress: () => void;
}

export default function DispatchItem({ dispatch, onPress }: DispatchItemProps) {
  const date = new Date(dispatch.dispatch_date).toLocaleDateString();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <AppText style={styles.dispatchNumber} numberOfLines={1}>
            #{dispatch.dispatch_number}
          </AppText>
          <AppText variant="caption" style={styles.dateText}>
            {date}
          </AppText>
        </View>

        <AppText style={styles.merchantName} numberOfLines={1}>
          {dispatch.merchant_name}
        </AppText>

        <View style={styles.footerRow}>
          <AppText variant="caption" style={styles.statsText}>
            {dispatch.total_bags} Bags • {dispatch.total_loose_lb} lb
          </AppText>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textSecondary}
        style={{ opacity: 0.5 }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    marginBottom: spacing.m,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  dispatchNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.s,
  },
  merchantName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: spacing.s,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  dateText: {
    color: colors.textSecondary,
  },
  statsText: {
    color: colors.textSecondary,
  },
});
