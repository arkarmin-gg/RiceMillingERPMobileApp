import { AppText } from "@/design-system/components";
import { spacing } from "@/design-system/tokens";
import { StockBalance } from "@/types/stock-balance";
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { StockBalanceItem } from "./stock-balance-item";

interface StockBalanceListProps {
  balances: StockBalance[];
  isLoading?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement;
  onItemPress?: (item: StockBalance) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  hideOwner?: boolean;
}

export function StockBalanceList({
  balances,
  isLoading = false,
  onRefresh,
  ListHeaderComponent,
  onItemPress,
  contentContainerStyle,
  hideOwner,
}: StockBalanceListProps) {
  return (
    <FlatList
      data={balances}
      keyExtractor={(item, index) =>
        `${item.owner_id}-${item.item_id}-${index}`
      }
      renderItem={({ item }) => (
        <StockBalanceItem
          item={item}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
          hideOwner={hideOwner}
        />
      )}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        ) : undefined
      }
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        !isLoading ? (
          <View style={styles.emptyContainer}>
            <AppText variant="bodySecondary">No stock balances found.</AppText>
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
