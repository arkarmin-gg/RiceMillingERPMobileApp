import i18n from "@/config/i18n";
import { EmptyState, ListSkeleton } from "@/design-system/components";
import { ActivityLog } from "@/types/activity-log";
import React from "react";
import { FlatList, RefreshControl, StyleProp, ViewStyle } from "react-native";
import { ActivityLogItem } from "./activity-log-item";

interface ActivityLogListProps {
  logs: ActivityLog[];
  isLoading?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement;
  onItemPress?: (item: ActivityLog) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ActivityLogList({
  logs,
  isLoading = false,
  onRefresh,
  ListHeaderComponent,
  onItemPress,
  contentContainerStyle,
}: ActivityLogListProps) {
  const renderItem = React.useCallback(
    ({ item }: { item: ActivityLog }) => (
      <ActivityLogItem item={item} onPress={onItemPress} />
    ),
    [onItemPress],
  );

  return (
    <FlatList
      data={logs}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        ) : undefined
      }
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        isLoading ? (
          <ListSkeleton count={3} />
        ) : (
          <EmptyState icon="time-outline" title={i18n.t("no_logs_found")} />
        )
      }
      contentContainerStyle={[contentContainerStyle]}
    />
  );
}
