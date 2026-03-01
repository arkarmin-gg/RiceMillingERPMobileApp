import { AppText } from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import {
  ProductionBatch,
  ProductionBatchStatus,
} from "@/types/production-batch";
import { Ionicons } from "@expo/vector-icons";
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
  const date = new Date(batch.production_date).toLocaleDateString();

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
          <AppText style={styles.batchNumber} numberOfLines={1}>
            #{batch.batch_number}
          </AppText>
          <AppText variant="caption" style={styles.dateText}>
            {date}
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
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surface,
    borderRadius: 10,
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
