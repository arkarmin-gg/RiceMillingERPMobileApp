import { AppText } from "@/components/ui/app-text";
import { colors, spacing } from "@/design-system/tokens";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  style?: ViewStyle;
}

export function EmptyState({
  icon = "document-text-outline",
  title,
  description,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={48} color={colors.textSecondary} />
      </View>
      <AppText variant="h2" style={styles.title}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="bodySecondary" style={styles.description}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    minHeight: 200,
  },
  iconContainer: {
    marginBottom: spacing.m,
    opacity: 0.5,
  },
  title: {
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  description: {
    textAlign: "center",
    color: colors.textSecondary,
    opacity: 0.8,
  },
});
