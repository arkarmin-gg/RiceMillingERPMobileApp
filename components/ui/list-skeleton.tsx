import { Skeleton } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import React from "react";
import { StyleSheet, View } from "react-native";

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.header}>
            <Skeleton width={48} height={48} borderRadius={24} />
            <View style={styles.content}>
              <Skeleton width="60%" height={20} style={styles.line} />
              <Skeleton width="40%" height={16} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: radii.card,
    marginBottom: spacing.m,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: spacing.m,
  },
  line: {
    marginBottom: spacing.xs,
  },
});
