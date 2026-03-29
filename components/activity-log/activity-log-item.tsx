import { AppText } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { ActivityLog } from "@/types/activity-log";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface ActivityLogItemProps {
  item: ActivityLog;
  onPress?: (item: ActivityLog) => void;
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: colors.success,
  UPDATE: colors.primary,
  DELETE: colors.danger,
  LOGIN: colors.navInactive,
};

const ACTION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  CREATE: "add-circle-outline",
  UPDATE: "create-outline",
  DELETE: "trash-outline",
  LOGIN: "log-in-outline",
};

export const ActivityLogItem = React.memo(function ActivityLogItem({
  item,
  onPress,
}: ActivityLogItemProps) {
  const actionColor = ACTION_COLORS[item.action] || colors.textSecondary;
  const actionIcon =
    ACTION_ICONS[item.action] ||
    ("information-circle-outline" as keyof typeof Ionicons.glyphMap);

  const formattedDate = new Date(item.created_at).toLocaleString();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(item);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <AppText style={styles.avatarText}>
              {item.user?.full_name?.charAt(0) || "?"}
            </AppText>
          </View>

          <View style={styles.userTextContainer}>
            <AppText
              variant="bodySecondary"
              style={styles.userName}
              numberOfLines={1}
            >
              {item.user?.full_name || "Unknown User"}
            </AppText>
            <AppText variant="caption" style={styles.date}>
              {formattedDate}
            </AppText>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: actionColor + "20" }]}>
          <Ionicons name={actionIcon} size={12} color={actionColor} />
          <AppText
            variant="caption"
            style={[styles.badgeText, { color: actionColor }]}
          >
            {item.action}
          </AppText>
        </View>
      </View>

      <View style={styles.content}>
        <AppText variant="body" style={styles.description}>
          {item.description}
        </AppText>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: radii.card,
    marginBottom: spacing.m,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pressed: {
    backgroundColor: colors.background,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.s,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.s,
  },
  userTextContainer: {
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.s,
  },
  avatarPlaceholder: {
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  userName: {
    fontWeight: "600",
    color: colors.textPrimary,
    fontSize: 14,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: radii.pill,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  content: {
    paddingTop: spacing.xs,
  },
  description: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
});
