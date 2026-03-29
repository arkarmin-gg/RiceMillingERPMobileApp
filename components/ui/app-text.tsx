import {
  spacing,
  textVariants,
  type TextVariant,
} from "@/design-system/tokens";
import { useLanguageStore } from "@/hooks/use-language";
import React from "react";
import { StyleSheet, Text } from "react-native";

type AppTextProps = React.ComponentProps<typeof Text> & {
  variant?: TextVariant;
};

export function AppText({ variant = "body", style, ...rest }: AppTextProps) {
  const baseStyle = textVariants[variant];
  const flattenedStyle = StyleSheet.flatten([baseStyle, style]) || {};
  const { locale } = useLanguageStore();

  const scaledStyle = {
    ...flattenedStyle,
    paddingBottom: locale === "my" ? spacing.xs : 0,
  };

  return <Text style={scaledStyle} {...rest} />;
}
