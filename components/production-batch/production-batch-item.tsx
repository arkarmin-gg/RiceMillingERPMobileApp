import { AppText } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import {
  ProductionBatch,
  ProductionBatchStatus,
} from "@/types/production-batch";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface ProductionBatchItemProps {
  batch: ProductionBatch;
  onPress: () => void;
}

export const STATUS_STYLES: Record<
  ProductionBatchStatus,
  { bg: string; text: string; label: string }
> = {
  PENDING: { bg: "#FEF3C7", text: "#D97706", label: "PENDING" },
  IN_PROGRESS: { bg: "#DBEAFE", text: "#1E40AF", label: "IN PROGRESS" },
  COMPLETED: { bg: "#DCFCE7", text: "#15803D", label: "COMPLETED" },
  CANCELLED: { bg: "#F1F5F9", text: "#475569", label: "CANCELLED" },
};

export default function ProductionBatchItem({
  batch,
  onPress,
}: ProductionBatchItemProps) {
  const statusStyle = STATUS_STYLES[batch.status] || STATUS_STYLES.PENDING;
  const dateObj = new Date(batch.production_date);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <AppText style={styles.batchNumber} numberOfLines={1}>
            #{batch.batch_number}
          </AppText>
          <AppText variant="caption" style={styles.dateText}>
            {date} {time}
          </AppText>
        </View>

        <AppText style={styles.merchantName} numberOfLines={1}>
          {batch.merchant_name}
        </AppText>

        <View style={styles.footerRow}>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <AppText style={[styles.badgeText, { color: statusStyle.text }]}>
              {statusStyle.label}
            </AppText>
          </View>
          <AppText variant="caption" style={styles.statsText}>
            {batch.total_bags} Bags • {batch.total_loose_lb} lb
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
  containerPressed: {
    backgroundColor: colors.background,
    transform: [{ scale: 0.98 }],
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
  batchNumber: {
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
