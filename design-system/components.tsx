import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  radii,
  shadows,
  spacing,
  textVariants,
  type TextVariant,
} from "./tokens";

type AppTextProps = React.ComponentProps<typeof Text> & {
  variant?: TextVariant;
};

export function AppText({ variant = "body", style, ...rest }: AppTextProps) {
  return <Text style={[textVariants[variant], style]} {...rest} />;
}

type ScreenProps = React.ComponentProps<typeof SafeAreaView>;

export function Screen({ style, ...rest }: ScreenProps) {
  return <SafeAreaView style={[styles.screen, style]} {...rest} />;
}

type CardProps = React.ComponentProps<typeof View>;

export function Card({ style, ...rest }: CardProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

type ButtonBaseProps = Omit<React.ComponentProps<typeof Pressable>, "style"> & {
  label: string;
  style?: StyleProp<ViewStyle>;
  rightIcon?: React.ReactNode;
};

export function PrimaryButton({
  label,
  rightIcon,
  style,
  ...rest
}: ButtonBaseProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        styles.primaryButton,
        pressed && styles.buttonPressed,
        style,
      ]}
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
  ...rest
}: ButtonBaseProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        styles.secondaryButton,
        pressed && styles.buttonPressed,
        style,
      ]}
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
  ...rest
}: ButtonBaseProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonBase,
        styles.dangerButton,
        pressed && styles.buttonPressed,
        style,
      ]}
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
  ...rest
}: IconButtonProps) {
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
        pressed && styles.buttonPressed,
        disabled && styles.fabDisabled,
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      {icon}
    </Pressable>
  );
}

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

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
};

export function TextField({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = React.useState(false);

  const borderStyle: ViewStyle = focused
    ? styles.inputFocused
    : error
      ? styles.inputError
      : styles.inputDefault;

  return (
    <View style={styles.fieldContainer}>
      {label ? (
        <AppText variant="bodySecondary" style={styles.fieldLabel}>
          {label}
        </AppText>
      ) : null}
      <View style={[styles.inputWrapper, borderStyle]}>
        {leftIcon ? <View style={styles.inputIconLeft}>{leftIcon}</View> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.inputIconRight}
          >
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" style={styles.fieldError}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

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
  }, [isOpen]);

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
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.m,
    paddingVertical: 0,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.m,
    ...shadows.card,
  },
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
    opacity: 0.7,
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
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeLabel: {
    fontSize: 12,
  },
  fieldContainer: {
    marginBottom: spacing.m,
  },
  fieldLabel: {
    color: colors.label,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    height: 48,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.m,
  },
  inputDefault: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  inputError: {
    borderWidth: 2,
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputIconLeft: {
    marginRight: spacing.s,
  },
  inputIconRight: {
    marginLeft: spacing.s,
  },
  fieldError: {
    marginTop: spacing.xs,
    color: colors.danger,
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
