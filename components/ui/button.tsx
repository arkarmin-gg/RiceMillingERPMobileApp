import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  GestureResponderEvent,
} from "react-native";
import { colors, radii, spacing } from "@/design-system/tokens";
import { AppText } from "./app-text";
import * as Haptics from "expo-haptics";

type ButtonBaseProps = Omit<React.ComponentProps<typeof Pressable>, "style"> & {
  label: string;
  style?: StyleProp<ViewStyle>;
  rightIcon?: React.ReactNode;
};

export function PrimaryButton({
  label,
  rightIcon,
  style,
  onPress,
  ...rest
}: ButtonBaseProps) {
  const handlePress = (e: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        styles.primaryButton,
        pressed && styles.buttonPressed,
        style,
      ]}
      onPress={handlePress}
      {...rest}
    >
      <AppText variant="button" style={styles.primaryButtonLabel}>
        {label}
      </AppText>
      {rightIcon ? (
        <View style={styles.buttonRightIcon}>{rightIcon}</View>
      ) : null}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  rightIcon,
  style,
  onPress,
  ...rest
}: ButtonBaseProps) {
  const handlePress = (e: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        styles.secondaryButton,
        pressed && styles.buttonPressed,
        style,
      ]}
      onPress={handlePress}
      {...rest}
    >
      <AppText variant="button" style={styles.secondaryButtonLabel}>
        {label}
      </AppText>
      {rightIcon ? (
        <View style={styles.buttonRightIcon}>{rightIcon}</View>
      ) : null}
    </Pressable>
  );
}

export function DangerButton({
  label,
  rightIcon,
  style,
  onPress,
  ...rest
}: ButtonBaseProps) {
  const handlePress = (e: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        styles.dangerButton,
        pressed && styles.buttonPressed,
        style,
      ]}
      onPress={handlePress}
      {...rest}
    >
      <AppText variant="button" style={styles.primaryButtonLabel}>
        {label}
      </AppText>
      {rightIcon ? (
        <View style={styles.buttonRightIcon}>{rightIcon}</View>
      ) : null}
    </Pressable>
  );
}

type IconButtonProps = Omit<React.ComponentProps<typeof Pressable>, "style"> & {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  variant = "primary",
  size = "medium",
  style,
  disabled,
  onPress,
  ...rest
}: IconButtonProps) {
  const handlePress = (e: GestureResponderEvent) => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(e);
    }
  };

  let variantStyle: ViewStyle = {};
  if (variant === "primary") variantStyle = styles.primaryButton;
  else if (variant === "secondary") variantStyle = styles.secondaryButton;
  else if (variant === "danger") variantStyle = styles.dangerButton;
  else if (variant === "ghost")
    variantStyle = { backgroundColor: "transparent", borderWidth: 0 };

  let sizeStyle: ViewStyle = {};
  if (size === "small")
    sizeStyle = { width: 32, height: 32, borderRadius: radii.pill };
  else if (size === "medium")
    sizeStyle = { width: 44, height: 44, borderRadius: radii.pill };
  else if (size === "large")
    sizeStyle = { width: 56, height: 56, borderRadius: radii.pill };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        { width: "auto", paddingHorizontal: 0 },
        variantStyle,
        sizeStyle,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.fabDisabled,
        style,
      ]}
      disabled={disabled}
      onPress={handlePress}
      {...rest}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 48,
    borderRadius: radii.button,
    paddingHorizontal: spacing.m,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonLabel: {
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  buttonRightIcon: {
    marginLeft: spacing.s,
  },
  fabDisabled: {
    opacity: 0.5,
  },
});
