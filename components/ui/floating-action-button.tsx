import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { AppText } from "./app-text";

export type FabVariant = "primary" | "secondary" | "danger";
export type FabSize = "small" | "normal" | "large";
export type FabPosition = "bottomRight" | "bottomLeft" | "center" | "relative";

type FloatingActionButtonProps = Omit<
  React.ComponentProps<typeof Pressable>,
  "style"
> & {
  icon?: React.ReactNode;
  label?: string;
  onPress: () => void;
  variant?: FabVariant;
  size?: FabSize;
  position?: FabPosition;
  style?: StyleProp<ViewStyle>;
};

export function FloatingActionButton({
  icon,
  label,
  onPress,
  variant = "primary",
  size = "normal",
  position = "bottomRight",
  style,
  disabled,
  ...rest
}: FloatingActionButtonProps) {
  const isExtended = !!label;

  let positionStyle: ViewStyle = {};
  if (position === "bottomRight") {
    positionStyle = {
      position: "absolute",
      bottom: spacing.l,
      right: spacing.m,
    };
  } else if (position === "bottomLeft") {
    positionStyle = {
      position: "absolute",
      bottom: spacing.l,
      left: spacing.m,
    };
  } else if (position === "center") {
    positionStyle = {
      position: "absolute",
      bottom: spacing.l,
      alignSelf: "center",
    };
  }

  let sizeStyle: ViewStyle = {};
  if (!isExtended) {
    if (size === "small") sizeStyle = styles.fabSmall;
    else if (size === "large") sizeStyle = styles.fabLarge;
    else sizeStyle = styles.fabNormal;
  } else {
    sizeStyle = styles.fabExtended;
  }

  let variantStyle: ViewStyle = styles.fabPrimary;
  let labelStyle = styles.primaryButtonLabel;

  if (variant === "secondary") {
    variantStyle = styles.fabSecondary;
    labelStyle = styles.secondaryButtonLabel;
  } else if (variant === "danger") {
    variantStyle = styles.fabDanger;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.fabBase,
        variantStyle,
        sizeStyle,
        positionStyle,
        pressed && styles.buttonPressed,
        disabled && styles.fabDisabled,
        style,
      ]}
      {...rest}
    >
      {icon ? (
        <View style={isExtended && styles.fabIconExtended}>{icon}</View>
      ) : null}
      {isExtended ? (
        <AppText variant="button" style={labelStyle}>
          {label}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export type FabAction = {
  icon: React.ReactNode;
  label?: string;
  onPress: () => void;
  variant?: FabVariant;
};

type FloatingActionMenuProps = Omit<
  FloatingActionButtonProps,
  "onPress" | "position"
> & {
  actions: FabAction[];
  position?: FabPosition;
  onPress?: () => void;
};

export function FloatingActionMenu({
  actions,
  icon,
  variant = "primary",
  position = "bottomRight",
  onPress,
  ...rest
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withSpring(isOpen ? 135 : 0, {
      damping: 30,
      stiffness: 80,
    });
  }, [isOpen, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const toggleMenu = () => {
    if (onPress) {
      onPress();
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  let containerStyle: ViewStyle = {
    position: "absolute",
    alignItems: "flex-end",
    zIndex: 999,
  };

  if (position === "bottomRight") {
    containerStyle = {
      ...containerStyle,
      bottom: spacing.l,
      right: spacing.m,
      alignItems: "flex-end",
    };
  } else if (position === "bottomLeft") {
    containerStyle = {
      ...containerStyle,
      bottom: spacing.l,
      left: spacing.m,
      alignItems: "flex-start",
    };
  } else if (position === "center") {
    containerStyle = {
      ...containerStyle,
      bottom: spacing.l,
      alignSelf: "center",
      alignItems: "center",
    };
  } else {
    containerStyle = {
      position: "relative",
      alignItems: "flex-end",
    };
  }

  return (
    <View style={containerStyle} pointerEvents="box-none">
      {isOpen && (
        <Animated.View
          style={{
            marginBottom: spacing.m,
            gap: spacing.m,
            alignItems: containerStyle.alignItems as any,
          }}
        >
          {actions.map((action, index) => (
            <View
              key={index}
              style={{
                flexDirection:
                  position === "bottomLeft" ? "row" : "row-reverse",
                alignItems: "center",
                gap: spacing.s,
              }}
            >
              {action.label ? (
                <View style={styles.fabActionLabelContainer}>
                  <AppText variant="caption" style={styles.fabActionLabel}>
                    {action.label}
                  </AppText>
                </View>
              ) : null}
              <FloatingActionButton
                size="small"
                variant={action.variant || "secondary"}
                icon={action.icon}
                onPress={() => {
                  action.onPress();
                  setIsOpen(false);
                }}
                position="relative"
              />
            </View>
          ))}
        </Animated.View>
      )}
      <FloatingActionButton
        {...rest}
        variant={variant}
        position="relative"
        icon={<Animated.View style={animatedIconStyle}>{icon}</Animated.View>}
        onPress={toggleMenu}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.7,
  },
  primaryButtonLabel: {
    color: "#FFFFFF",
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
  },
  fabBase: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    ...shadows.card,
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  fabNormal: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fabLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  fabExtended: {
    height: 56,
    borderRadius: 28,
    paddingHorizontal: spacing.l,
  },
  fabPrimary: {
    backgroundColor: colors.primary,
  },
  fabSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  fabDanger: {
    backgroundColor: colors.danger,
  },
  fabDisabled: {
    opacity: 0.5,
  },
  fabIconExtended: {
    marginRight: spacing.s,
  },
  fabActionLabelContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: radii.pill,
    ...shadows.card,
    elevation: 2,
  },
  fabActionLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
});
