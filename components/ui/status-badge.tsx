import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { colors, radii } from "@/design-system/tokens";
import { AppText } from "./app-text";

type StatusBadgeVariant = "open" | "closed";

type StatusBadgeProps = {
  variant: StatusBadgeVariant;
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function StatusBadge({ variant, label, style }: StatusBadgeProps) {
  const palette =
    variant === "open"
      ? {
          backgroundColor: colors.badgeOpenBackground,
          color: colors.badgeOpenText,
        }
      : {
          backgroundColor: colors.badgeClosedBackground,
          color: colors.badgeClosedText,
        };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: palette.backgroundColor },
        style,
      ]}
    >
      <AppText
        variant="caption"
        style={[styles.badgeLabel, { color: palette.color }]}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeLabel: {
    fontSize: 12,
  },
});
