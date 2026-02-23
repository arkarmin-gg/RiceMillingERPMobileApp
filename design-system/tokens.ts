import type { TextStyle, ViewStyle } from "react-native";

export const colors = {
  primary: "#1E40AF",
  success: "#15803D",
  warning: "#B45309",
  danger: "#B91C1C",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  borderSubtle: "#E2E8F0",
  borderStrong: "#CBD5E1",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  label: "#475569",
  navInactive: "#94A3B8",
  navBorder: "#E2E8F0",
  badgeOpenBackground: "#FEF3C7",
  badgeOpenText: "#B45309",
  badgeClosedBackground: "#DCFCE7",
  badgeClosedText: "#15803D",
} as const;

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
} as const;

export const radii = {
  card: 12,
  button: 12,
  input: 12,
  pill: 999,
} as const;

export const shadows: { card: ViewStyle } = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
};

export type TextVariant =
  | "h1"
  | "h2"
  | "body"
  | "bodySecondary"
  | "caption"
  | "button";

export const textVariants: Record<TextVariant, TextStyle> = {
  h1: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
};

