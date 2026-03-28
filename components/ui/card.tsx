import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";

type CardProps = React.ComponentProps<typeof View>;

export function Card({ style, ...rest }: CardProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.m,
    ...shadows.card,
  },
});
