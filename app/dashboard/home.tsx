import { ActivityLogList } from "@/components/activity-log/activity-log-list";
import { QuickActions } from "@/components/home/quick-actions";
import { StockOverviewList } from "@/components/items/stock-overview-list";
import i18n from "@/config/i18n";
import { AppText, Screen } from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { useActivityLogs } from "@/hooks/use-activity-logs";
import { useItemsWithStock } from "@/hooks/use-items";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const {
    data: stockData,
    isLoading: stockIsLoading,
    error: stockError,
    refetch: stockRefetch,
  } = useItemsWithStock();
  const {
    data: activityLogsData,
    isLoading: activityIsLoading,
    error: activityError,
    refetch: activityRefetch,
  } = useActivityLogs({ limit: 10 });

  const onRefresh = useCallback(() => {
    activityRefetch();
    stockRefetch();
  }, [activityRefetch, stockRefetch]);

  if (stockIsLoading || activityIsLoading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  if (stockError || activityError) {
    return (
      <Screen style={styles.center}>
        <AppText variant="body" style={{ color: colors.danger }}>
          {i18n.t("failed_to_load_data")}
        </AppText>
        <AppText variant="caption" style={{ marginTop: spacing.s }}>
          {stockError?.message || activityError?.message}
        </AppText>
      </Screen>
    );
  }

  const items = stockData?.data || [];
  const logs = activityLogsData?.data || [];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <StockOverviewList items={items} />
      <QuickActions />
      <View>
        <AppText variant="caption">{i18n.t("recent_activity")}</AppText>
      </View>
    </View>
  );

  return (
    <Screen>
      <ActivityLogList
        logs={logs}
        isLoading={stockIsLoading || activityIsLoading}
        onRefresh={onRefresh}
        ListHeaderComponent={renderHeader()}
        onItemPress={(item) =>
          router.push({
            pathname: "/dashboard/activity-log/[id]",
            params: { id: item.id },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    gap: spacing.m,
    marginBottom: spacing.m,
  },
});
