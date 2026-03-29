import i18n from "@/config/i18n";
import { AppText, Screen } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { useDispatch } from "@/hooks/use-dispatches";
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

export default function DispatchDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useDispatch(id);

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
          {i18n.t("error")}
        </AppText>
      </Screen>
    );
  }

  const dispatch = data.data;
  const date = new Date(dispatch.dispatch_date).toLocaleDateString();

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: `${i18n.t("dispatch")} #${dispatch.dispatch_number}`,
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/dashboard/dispatches/edit",
                  params: { id: dispatch.id },
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
              <AppText variant="caption">{i18n.t("dispatch")}</AppText>
              <AppText variant="h2" style={styles.dispatchNumber}>
                #{dispatch.dispatch_number}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <AppText variant="caption">{i18n.t("merchant")}</AppText>
              <AppText variant="body" style={styles.infoValue}>
                {dispatch.merchant_name}
              </AppText>
            </View>
            <View style={styles.infoItem}>
              <AppText variant="caption">{i18n.t("dispatch_date")}</AppText>
              <AppText variant="body" style={styles.infoValue}>
                {date}
              </AppText>
            </View>
          </View>

          {dispatch.description && (
            <View style={{ marginTop: spacing.m }}>
              <AppText variant="caption">{i18n.t("description")}</AppText>
              <AppText variant="body" style={styles.infoValue}>
                {dispatch.description}
              </AppText>
            </View>
          )}
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          <AppText variant="h2" style={styles.sectionTitle}>
            {i18n.t("information")}
          </AppText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AppText variant="caption">Total Qty</AppText>
              <AppText variant="h1" style={styles.statValue}>
                {dispatch.total_quantity}
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText variant="caption">Total {i18n.t("bags")}</AppText>
              <AppText variant="h1" style={styles.statValue}>
                {dispatch.total_bags}
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText variant="caption">{i18n.t("loose_lb")}</AppText>
              <AppText variant="h1" style={styles.statValue}>
                {dispatch.total_loose_lb}
              </AppText>
            </View>
          </View>
        </View>

        {/* Items Section */}
        <AppText variant="h2" style={styles.sectionHeader}>
          {i18n.t("items")} ({dispatch.items?.length || 0})
        </AppText>

        <View style={styles.itemsList}>
          {dispatch.items?.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <AppText variant="body" style={styles.itemName}>
                  {item.item_name}
                </AppText>
                <AppText variant="h2" style={styles.itemQuantity}>
                  {item.bags} {i18n.t("bags")} • {item.loose_lb} lb Loose
                </AppText>
              </View>
              <View style={styles.itemDetails}>
                <AppText variant="bodySecondary">{item.quantity} QTY</AppText>
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
  dispatchNumber: {
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
  itemsList: {
    gap: spacing.s,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  itemHeader: {
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
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
