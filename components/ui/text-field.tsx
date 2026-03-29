import { colors, radii, spacing } from "@/design-system/tokens";
import { useLanguageStore } from "@/hooks/use-language";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { AppText } from "./app-text";

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
  const { locale } = useLanguageStore();
  const scale = locale === "my" ? 0.85 : 1;

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
      <View
        style={[
          styles.inputWrapper,
          borderStyle,
          rest.multiline && styles.inputWrapperMultiline,
        ]}
      >
        {leftIcon ? <View style={styles.inputIconLeft}>{leftIcon}</View> : null}
        <TextInput
          style={[
            styles.input,
            {
              fontSize: Math.round(16 * scale),
              paddingBottom: locale === "my" ? spacing.xs : 0,
            },
            rest.style,
          ]}
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
    minHeight: 48,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.m,
  },
  inputWrapperMultiline: {
    alignItems: "flex-start",
    paddingVertical: spacing.s,
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
    paddingBottom: 0,
  },
  inputIconRight: {
    marginLeft: spacing.s,
  },
  fieldError: {
    marginTop: spacing.xs,
    color: colors.danger,
  },
});
