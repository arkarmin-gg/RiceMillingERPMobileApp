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

type ScreenProps = React.ComponentProps<typeof View>;

export function Screen({ style, ...rest }: ScreenProps) {
  return <View style={[styles.screen, style]} {...rest} />;
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
      style={[styles.buttonBase, styles.primaryButton, style]}
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
      style={[styles.buttonBase, styles.secondaryButton, style]}
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
  label: string;
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
      <AppText variant="bodySecondary" style={styles.fieldLabel}>
        {label}
      </AppText>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.l,
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
});
