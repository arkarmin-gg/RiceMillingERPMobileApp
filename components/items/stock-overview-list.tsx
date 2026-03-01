import { AppText } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { ItemWithStock } from "@/types/item";
import React from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";

interface StockOverviewListProps {
  items: ItemWithStock[];
}

export function StockOverviewList({ items }: StockOverviewListProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7; // Card takes 70% of screen width

  return (
    <View>
      <View style={styles.header}>
        <AppText variant="h2">Stock Overview</AppText>
      </View>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        snapToInterval={cardWidth + spacing.m}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth }]}>
            <View style={styles.cardHeader}>
              <AppText variant="h2" style={styles.itemName} numberOfLines={1}>
                {item.name}
              </AppText>
              <View style={styles.badge}>
                <AppText variant="caption" style={styles.badgeText}>
                  {item.category}
                </AppText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText variant="caption">Total</AppText>
                <AppText variant="body" style={styles.statValue}>
                  {item.total_quantity.toLocaleString()}
                </AppText>
              </View>
              <View style={styles.statItem}>
                <AppText variant="caption">Bags</AppText>
                <AppText variant="body" style={styles.statValue}>
                  {item.total_bags.toLocaleString()}
                </AppText>
              </View>
              <View style={styles.statItem}>
                <AppText variant="caption">Loose</AppText>
                <AppText variant="body" style={styles.statValue}>
                  {item.total_loose_lb.toLocaleString()}
                </AppText>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={[styles.center, { width: width - spacing.xl }]}>
            <AppText variant="bodySecondary">No items found.</AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingBottom: spacing.s,
  },
  listContent: {
    paddingBottom: spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginRight: spacing.m,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.s,
  },
  itemName: {
    flex: 1,
    marginRight: spacing.s,
  },
  badge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginBottom: spacing.m,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    marginTop: spacing.xs,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
