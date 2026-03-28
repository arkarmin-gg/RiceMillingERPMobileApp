import { textVariants, type TextVariant } from "@/design-system/tokens";
import React from "react";
import { Text } from "react-native";

type AppTextProps = React.ComponentProps<typeof Text> & {
  variant?: TextVariant;
};

export function AppText({ variant = "body", style, ...rest }: AppTextProps) {
  return <Text style={[textVariants[variant], style]} {...rest} />;
}
