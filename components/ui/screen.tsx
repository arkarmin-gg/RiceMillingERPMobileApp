import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/design-system/tokens";

type ScreenProps = React.ComponentProps<typeof SafeAreaView>;

export function Screen({ style, ...rest }: ScreenProps) {
  return <SafeAreaView style={[styles.screen, style]} {...rest} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.m,
  },
});
