import { CustomHeader } from "@/components/ui/custom-header";
import { AppText, Screen } from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useActivityLog } from "@/hooks/use-activity-logs";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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

export default function ActivityLogDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useActivityLog(id!);

  if (isLoading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen style={styles.center}>
        <AppText variant="body" style={{ color: colors.danger }}>
          Failed to load activity log details.
        </AppText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AppText variant="button" style={{ color: colors.primary }}>
            Go Back
          </AppText>
        </TouchableOpacity>
      </Screen>
    );
  }

  const log = data.data;
  const actionColor = ACTION_COLORS[log.action] || colors.textSecondary;
  const actionIcon =
    ACTION_ICONS[log.action] ||
    ("information-circle-outline" as keyof typeof Ionicons.glyphMap);
  const formattedDate = new Date(log.created_at).toLocaleString();

  // Helper to render property changes
  const renderPropertyChanges = () => {
    // For DispatchItem and ProductionOutput, combine bags and loose_lb into quantity
    const subjectType = log.subject_type?.split("\\").pop();
    const isQuantityItem =
      subjectType && ["DispatchItem", "ProductionOutput"].includes(subjectType);

    if (!isQuantityItem) return null;

    if (!log.properties) return null;

    const oldProps = log.properties.old || {};
    const newProps = log.properties.new || {};
    const allKeys = new Set([
      ...Object.keys(oldProps),
      ...Object.keys(newProps),
    ]);

    // Filter out internal fields like updated_at, created_at unless relevant
    let relevantKeys = Array.from(allKeys).filter(
      (key) => !["updated_at", "created_at", "id"].includes(key),
    );

    // Only show quantity changes for these items
    const hasQuantityChanges = relevantKeys.some((key) =>
      ["bags", "loose_lb", "quantity"].includes(key),
    );

    if (hasQuantityChanges) {
      relevantKeys = ["quantity"];
    } else {
      relevantKeys = [];
    }

    if (relevantKeys.length === 0) {
      // If only timestamps changed or no specific properties recorded
      return (
        <View style={styles.section}>
          <AppText variant="caption" style={styles.sectionTitle}>
            Changes
          </AppText>
          <AppText variant="bodySecondary">
            No specific property changes recorded.
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <AppText variant="caption" style={styles.sectionTitle}>
          Changes
        </AppText>
        {relevantKeys.map((key) => {
          let oldValueDisplay = JSON.stringify(oldProps[key]) ?? "-";
          let newValueDisplay = JSON.stringify(newProps[key]) ?? "-";

          // Custom formatting for quantity
          if (key === "quantity") {
            const oldBags = oldProps["bags"] ?? 0;
            const oldLb = oldProps["loose_lb"] ?? 0;
            const newBags = newProps["bags"] ?? 0;
            const newLb = newProps["loose_lb"] ?? 0;

            if (oldProps[key] !== undefined || oldProps["bags"] !== undefined) {
              oldValueDisplay = `${oldBags} Bags ${oldLb} Lb`;
            }
            if (newProps[key] !== undefined || newProps["bags"] !== undefined) {
              newValueDisplay = `${newBags} Bags ${newLb} Lb`;
            }
          }

          return (
            <View key={key} style={styles.changeItem}>
              <AppText variant="caption" style={styles.changeLabel}>
                {key.replace(/_/g, " ")}
              </AppText>
              <View style={styles.changeValues}>
                <View style={styles.oldValue}>
                  <AppText variant="caption" style={{ color: colors.danger }}>
                    Old
                  </AppText>
                  <AppText variant="body" style={styles.valueText}>
                    {oldValueDisplay}
                  </AppText>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginHorizontal: spacing.s }}
                />
                <View style={styles.newValue}>
                  <AppText variant="caption" style={{ color: colors.success }}>
                    New
                  </AppText>
                  <AppText variant="body" style={styles.valueText}>
                    {newValueDisplay}
                  </AppText>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title="Activity Log Detail"
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.userInfoHeader}>
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <AppText style={styles.avatarText}>
                {log.user?.full_name?.charAt(0) || "?"}
              </AppText>
            </View>
            <View>
              <AppText variant="body" style={styles.userName}>
                {log.user?.full_name || "Unknown User"}
              </AppText>
              <AppText
                variant="caption"
                style={{ color: colors.textSecondary }}
              >
                {log.user?.email}
              </AppText>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <AppText variant="caption">IP Address</AppText>
              <AppText variant="bodySecondary">{log.ip_address}</AppText>
            </View>
            <View style={styles.metaItem}>
              <AppText variant="caption">Date</AppText>
              <AppText variant="bodySecondary">{formattedDate}</AppText>
            </View>
          </View>
        </View>

        {/* Action Info */}
        <View style={styles.card}>
          <View
            style={[
              styles.actionBadge,
              { backgroundColor: actionColor + "20" },
            ]}
          >
            <Ionicons name={actionIcon} size={20} color={actionColor} />
            <AppText
              variant="caption"
              style={[styles.actionText, { color: actionColor }]}
            >
              {log.action}
            </AppText>
          </View>
          <AppText variant="body" style={styles.description}>
            {log.description}
          </AppText>
          <View style={styles.subjectInfo}>
            <AppText variant="caption">Subject Type: </AppText>
            <AppText variant="bodySecondary">
              {log.subject_type?.split("\\").pop()}
            </AppText>
          </View>
        </View>

        {/* Changes */}
        {renderPropertyChanges()}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    gap: spacing.m,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  backIcon: {
    marginRight: spacing.m,
  },
  backButton: {
    marginTop: spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    ...({
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    } as any),
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  userInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.m,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.m,
  },
  avatarPlaceholder: {
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  userName: {
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.m,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    gap: 4,
  },
  actionBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: radii.pill,
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  actionText: {
    fontWeight: "600",
  },
  description: {
    marginBottom: spacing.s,
  },
  subjectInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    marginTop: spacing.s,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  changeItem: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: radii.card,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  changeLabel: {
    marginBottom: spacing.s,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  changeValues: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  oldValue: {
    flex: 1,
  },
  newValue: {
    flex: 1,
    alignItems: "flex-end",
  },
  valueText: {
    marginTop: 4,
  },
});
