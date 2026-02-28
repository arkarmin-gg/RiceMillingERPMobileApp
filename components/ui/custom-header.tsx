import { AppText, IconButton } from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type CustomHeaderProps = {
  title?: string;
  leftIcon?: React.ReactNode;
  onLeftPress?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  style?: ViewStyle;
  showBack?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  hideBorder?: boolean;
  titleAlign?: "left" | "center" | "right";
};

export function CustomHeader({
  title,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  style,
  showBack,
  backgroundColor = colors.surface,
  titleColor = colors.textPrimary,
  hideBorder = false,
  titleAlign = "center",
}: CustomHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    if (onLeftPress) {
      onLeftPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const actualLeftIcon = showBack ? (
    <Ionicons name="arrow-back" size={24} color={titleColor} />
  ) : (
    leftIcon
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: insets.top,
          height: (Platform.OS === "android" ? 56 : 44) + insets.top,
          borderBottomWidth: hideBorder ? 0 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.leftContainer,
            titleAlign === "left" && !actualLeftIcon && { width: spacing.s },
          ]}
        >
          {actualLeftIcon ? (
            <IconButton
              icon={actualLeftIcon}
              onPress={showBack ? handleBack : onLeftPress || (() => {})}
              variant="ghost"
              disabled={!showBack && !onLeftPress}
            />
          ) : null}
        </View>

        <View
          style={[
            styles.centerContainer,
            {
              alignItems:
                titleAlign === "left"
                  ? "flex-start"
                  : titleAlign === "right"
                    ? "flex-end"
                    : "center",
            },
          ]}
        >
          {title ? (
            <AppText
              variant="h2"
              style={[styles.title, { color: titleColor }]}
              numberOfLines={1}
            >
              {title}
            </AppText>
          ) : null}
        </View>

        <View style={styles.rightContainer}>
          {rightIcon ? (
            <IconButton
              icon={rightIcon}
              onPress={onRightPress || (() => {})}
              variant="ghost"
              disabled={!onRightPress}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomColor: colors.borderSubtle,
    zIndex: 100,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.s,
  },
  leftContainer: {
    width: 48,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    width: 48,
    alignItems: "flex-end",
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
});
