import { ActivityLogList } from "@/components/activity-log/activity-log-list";
import { CustomHeader } from "@/components/ui/custom-header";
import { AppText, Screen } from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { useActivityLogs } from "@/hooks/use-activity-logs";
import { Stack, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function ActivityLogIndex() {
  const router = useRouter();
  const {
    data: activityLogsData,
    isLoading: activityIsLoading,
    error: activityError,
    refetch: activityRefetch,
  } = useActivityLogs();

  const onRefresh = useCallback(() => {
    activityRefetch();
  }, [activityRefetch]);

  if (activityIsLoading) {
    return (
      <Screen style={styles.center}>
        <Stack.Screen
          options={{
            header: () => (
              <CustomHeader
                title="Activity Logs"
                showBack
                onLeftPress={() => router.back()}
              />
            ),
          }}
        />
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  if (activityError) {
    return (
      <Screen style={styles.center}>
        <AppText variant="body" style={{ color: colors.danger }}>
          Failed to load activity logs.
        </AppText>
        <AppText variant="caption" style={{ marginTop: 8 }}>
          {activityError?.message}
        </AppText>
      </Screen>
    );
  }

  const logs = activityLogsData?.data || [];

  return (
    <Screen>
      <ActivityLogList
        logs={logs}
        isLoading={activityIsLoading}
        onRefresh={onRefresh}
        onItemPress={(item) =>
          router.push({
            pathname: "/dashboard/activity-log/[id]",
            params: { id: item.id },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingBottom: spacing.m,
  },
});
