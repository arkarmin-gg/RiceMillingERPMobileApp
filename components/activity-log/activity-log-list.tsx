import { AppText } from "@/design-system/components";
import { spacing } from "@/design-system/tokens";
import { ActivityLog } from "@/types/activity-log";
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
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
        !isLoading ? (
          <View style={styles.emptyContainer}>
            <AppText variant="bodySecondary">No activity logs found.</AppText>
          </View>
        ) : null
      }
      contentContainerStyle={[contentContainerStyle]}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
});
