import { STATUS_STYLES } from "@/components/production-batch/production-batch-item";
import { AppText, Screen } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { useProductionBatch } from "@/hooks/use-production-batches";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductionBatchDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useProductionBatch(id);

  if (isLoading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  if (error || !data?.data) {
    return (
      <Screen style={styles.center}>
        <AppText variant="h2" style={{ color: colors.danger }}>
          Failed to load batch details
        </AppText>
      </Screen>
    );
  }

  const batch = data.data;
  const statusStyle = STATUS_STYLES[batch.status] || STATUS_STYLES.PENDING;
  const date = new Date(batch.production_date).toLocaleDateString();

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: `Batch #${batch.batch_number}`,
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/dashboard/production-batch/edit",
                  params: { id: batch.id },
                })
              }
              style={{ marginRight: spacing.s }}
            >
              <Ionicons
                name="create-outline"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <AppText variant="caption">Batch Number</AppText>
              <AppText variant="h2" style={styles.batchNumber}>
                #{batch.batch_number}
              </AppText>
            </View>
            <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
              <AppText style={[styles.badgeText, { color: statusStyle.text }]}>
                {statusStyle.label}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <AppText variant="caption">Merchant</AppText>
              <AppText variant="body" style={styles.infoValue}>
                {batch.merchant_name}
              </AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption">Date</AppText>
              <AppText variant="body" style={styles.infoValue}>
                {date}
              </AppText>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          <AppText variant="h2" style={styles.sectionTitle}>
            Summary
          </AppText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AppText variant="caption">Total Qty</AppText>
              <AppText variant="h1" style={styles.statValue}>
                {batch.total_quantity}
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText variant="caption">Total Bags</AppText>
              <AppText variant="h1" style={styles.statValue}>
                {batch.total_bags}
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText variant="caption">Loose (lb)</AppText>
              <AppText variant="h1" style={styles.statValue}>
                {batch.total_loose_lb}
              </AppText>
            </View>
          </View>
        </View>

        {/* Outputs Section */}
        <AppText variant="h2" style={styles.sectionHeader}>
          Outputs ({batch.outputs?.length || 0})
        </AppText>

        <View style={styles.outputsList}>
          {batch.outputs?.map((output) => (
            <View key={output.id} style={styles.outputCard}>
              <View style={styles.outputHeader}>
                <AppText variant="body" style={styles.itemName}>
                  {output.item_name}
                </AppText>
                <AppText variant="h2" style={styles.itemQuantity}>
                  {/* {output.quantity} QTY */}
                  {output.bags} Bags • {output.loose_lb} lb Loose
                </AppText>
              </View>
              <View style={styles.outputDetails}>
                <AppText variant="bodySecondary">{output.quantity} QTY</AppText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: spacing["2xl"],
    gap: spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  batchNumber: {
    color: colors.textPrimary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.m,
  },
  infoRow: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  infoItem: {
    flex: 1,
  },
  infoValue: {
    marginTop: 2,
    fontWeight: "500",
  },
  sectionTitle: {
    marginBottom: spacing.m,
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: colors.primary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderSubtle,
  },
  sectionHeader: {
    marginTop: spacing.s,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  outputsList: {
    gap: spacing.s,
  },
  outputCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  outputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  itemName: {
    fontWeight: "600",
    fontSize: 16,
  },
  itemQuantity: {
    fontSize: 16,
  },
  outputDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
