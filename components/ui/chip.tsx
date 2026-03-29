import { AppText } from "@/components/ui/app-text";
import { colors, radii, spacing } from "@/design-system/tokens";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <AppText style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontWeight: "500",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
});
