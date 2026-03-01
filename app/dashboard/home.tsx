import { QuickActions } from "@/components/home/quick-actions";
import { StockOverviewList } from "@/components/items/stock-overview-list";
import { AppText, Screen } from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { useItemsWithStock } from "@/hooks/use-items";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function Home() {
  const { data, isLoading, error, refetch } = useItemsWithStock();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.center}>
        <AppText variant="body" style={{ color: colors.danger }}>
          Failed to load items stock.
        </AppText>
        <AppText variant="caption" style={{ marginTop: spacing.s }}>
          {error.message}
        </AppText>
      </Screen>
    );
  }

  const items = data?.data || [];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <StockOverviewList items={items} />
        <QuickActions />
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
  container: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
    gap: spacing.m,
  },
});
