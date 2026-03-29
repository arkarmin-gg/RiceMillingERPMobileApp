import i18n from "@/config/i18n";
import { AppText } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { StockBalance } from "@/types/stock-balance";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface StockBalanceItemProps {
  item: StockBalance;
  onPress?: () => void;
  hideOwner?: boolean;
}

const AVATAR_COLORS = [
  "#DBEAFE", // Blue
  "#DCFCE7", // Green
  "#F3E8FF", // Purple
  "#FFEDD5", // Orange
  "#FCE7F3", // Pink
  "#E0F2FE", // Light Blue
];

const AVATAR_TEXT_COLORS = [
  "#1E40AF", // Blue
  "#15803D", // Green
  "#7E22CE", // Purple
  "#C2410C", // Orange
  "#BE185D", // Pink
  "#0369A1", // Light Blue
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return {
    bg: AVATAR_COLORS[index],
    text: AVATAR_TEXT_COLORS[index],
  };
}

export function StockBalanceItem({
  item,
  onPress,
  hideOwner,
}: StockBalanceItemProps) {
  const avatarColors = getAvatarColor(item.owner_name);
  const initial = item.owner_name.charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { backgroundColor: colors.background },
      ]}
    >
      {!hideOwner && (
        <View style={[styles.avatar, { backgroundColor: avatarColors.bg }]}>
          <AppText
            style={{
              color: avatarColors.text,
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            {initial}
          </AppText>
        </View>
      )}

      <View style={[styles.content, hideOwner && { marginLeft: 0 }]}>
        {!hideOwner && (
          <AppText style={styles.name} numberOfLines={1}>
            {item.owner_name}
          </AppText>
        )}
        <AppText
          style={[
            styles.itemName,
            hideOwner && {
              fontSize: 16,
              fontWeight: "600",
              color: colors.textPrimary,
            },
          ]}
          numberOfLines={1}
        >
          {item.item_name}
        </AppText>

        <View style={styles.row}>
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>
              {item.bags} {i18n.t("bags")}
            </AppText>
          </View>
          {item.loose_lb > 0 && (
            <AppText
              variant="caption"
              style={{ color: colors.textSecondary, marginLeft: spacing.s }}
            >
              • {item.loose_lb} lb
            </AppText>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    marginBottom: spacing.m,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: spacing.m,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemName: {
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#1E40AF",
  },
});
