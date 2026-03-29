import { ActivityLogList } from "@/components/activity-log/activity-log-list";
import { CustomHeader } from "@/components/ui/custom-header";
import { SelectField } from "@/components/ui/select-field";
import i18n from "@/config/i18n";
import {
  AppText,
  PrimaryButton,
  Screen,
  SecondaryButton,
  TextField,
} from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useActivityLogs } from "@/hooks/use-activity-logs";
import { useUsers } from "@/hooks/use-users";
import { ActivityLog } from "@/types/activity-log";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ActivityLogIndex() {
  const router = useRouter();
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Temporary filter states for modal
  const [tempAction, setTempAction] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [tempFromDate, setTempFromDate] = useState<Date | undefined>();
  const [tempToDate, setTempToDate] = useState<Date | undefined>();

  // Calculate active filters count
  const activeFiltersCount = [action, userId, fromDate, toDate].filter(
    Boolean,
  ).length;

  // Initialize temp filters when opening modal
  const openFilterModal = () => {
    setTempAction(action);
    setTempUserId(userId);
    setTempFromDate(fromDate);
    setTempToDate(toDate);
    setIsFilterModalVisible(true);
  };

  const applyFilters = () => {
    setAction(tempAction);
    setUserId(tempUserId);
    setFromDate(tempFromDate);
    setToDate(tempToDate);
    setIsFilterModalVisible(false);
  };

  const resetFilters = useCallback(() => {
    setTempAction("");
    setTempUserId("");
    setTempFromDate(undefined);
    setTempToDate(undefined);
  }, []);

  const toLocalDateString = (date?: Date) => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFromDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowFromPicker(false);
    if (selectedDate) setTempFromDate(selectedDate);
  };

  const handleToDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowToPicker(false);
    if (selectedDate) setTempToDate(selectedDate);
  };

  // Fetch Users for filter
  const { data: usersData } = useUsers({
    get_all: true,
  });

  const userOptions = [
    { label: i18n.t("all_users"), value: "" },
    ...(usersData?.data.map((u) => ({
      label: u.full_name,
      value: u.id,
    })) || []),
  ];

  const actionOptions = [
    { label: i18n.t("all_actions"), value: "" },
    { label: i18n.t("create"), value: "CREATE" },
    { label: i18n.t("update"), value: "UPDATE" },
    { label: i18n.t("delete"), value: "DELETE" },
    { label: i18n.t("login"), value: "LOGIN" },
    { label: i18n.t("logout"), value: "LOGOUT" },
  ];

  const {
    data: activityLogsData,
    isLoading: activityIsLoading,
    error: activityError,
    refetch: activityRefetch,
  } = useActivityLogs({
    // Note: Search is not supported by API yet for logs, but if it was:
    // search: debouncedSearch,
    action: action || undefined,
    user_id: userId || undefined,
    from_date: toLocalDateString(fromDate),
    to_date: toLocalDateString(toDate),
  });

  const onRefresh = useCallback(() => {
    activityRefetch();
  }, [activityRefetch]);

  const handleItemPress = useCallback(
    (item: ActivityLog) => {
      router.push({
        pathname: "/dashboard/activity-log/[id]",
        params: { id: item.id },
      });
    },
    [router],
  );

  const renderContent = () => {
    if (activityIsLoading && !activityLogsData) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (activityError) {
      return (
        <View style={styles.center}>
          <AppText variant="body" style={{ color: colors.danger }}>
            {i18n.t("failed_to_load_data")}
          </AppText>
          <AppText variant="caption" style={{ marginTop: 8 }}>
            {activityError?.message}
          </AppText>
        </View>
      );
    }

    const logs = activityLogsData?.data || [];

    if (!logs.length) {
      return (
        <View style={styles.center}>
          <AppText variant="h2" style={{ color: colors.textSecondary }}>
            {i18n.t("no_logs_found")}
          </AppText>
        </View>
      );
    }

    return (
      <ActivityLogList
        logs={logs}
        isLoading={activityIsLoading}
        onRefresh={onRefresh}
        onItemPress={handleItemPress}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <Screen style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={i18n.t("activity_logs")}
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFiltersCount > 0 && styles.filterButtonActive,
            ]}
            onPress={openFilterModal}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={activeFiltersCount > 0 ? "white" : colors.textPrimary}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.badge}>
                <AppText style={styles.badgeText}>{activeFiltersCount}</AppText>
              </View>
            )}
            <AppText
              style={[
                styles.filterText,
                activeFiltersCount > 0 && { color: "white" },
              ]}
            >
              {i18n.t("filters")}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {renderContent()}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant="h2">{i18n.t("filters")}</AppText>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.filterSection}>
                <SelectField
                  label={i18n.t("action")}
                  placeholder={i18n.t("all_actions")}
                  value={tempAction}
                  options={actionOptions}
                  onChange={setTempAction}
                />
              </View>

              <View style={styles.filterSection}>
                <SelectField
                  label={i18n.t("user")}
                  placeholder={i18n.t("all_users")}
                  value={tempUserId}
                  options={userOptions}
                  onChange={setTempUserId}
                />
              </View>

              <View style={styles.filterSection}>
                <AppText variant="bodySecondary" style={styles.sectionLabel}>
                  {i18n.t("date_range")}
                </AppText>
                <View style={styles.dateRow}>
                  <View style={styles.dateInput}>
                    <TouchableOpacity onPress={() => setShowFromPicker(true)}>
                      <View pointerEvents="none">
                        <TextField
                          label={i18n.t("from_date")}
                          placeholder="YYYY-MM-DD"
                          value={toLocalDateString(tempFromDate) || ""}
                          editable={false}
                          rightIcon={
                            <Ionicons
                              name="calendar-outline"
                              size={20}
                              color={colors.textSecondary}
                            />
                          }
                        />
                      </View>
                    </TouchableOpacity>
                    {tempFromDate && (
                      <TouchableOpacity
                        style={styles.clearDate}
                        onPress={() => setTempFromDate(undefined)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.dateInput}>
                    <TouchableOpacity onPress={() => setShowToPicker(true)}>
                      <View pointerEvents="none">
                        <TextField
                          label={i18n.t("to_date")}
                          placeholder="YYYY-MM-DD"
                          value={toLocalDateString(tempToDate) || ""}
                          editable={false}
                          rightIcon={
                            <Ionicons
                              name="calendar-outline"
                              size={20}
                              color={colors.textSecondary}
                            />
                          }
                        />
                      </View>
                    </TouchableOpacity>
                    {tempToDate && (
                      <TouchableOpacity
                        style={styles.clearDate}
                        onPress={() => setTempToDate(undefined)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <SecondaryButton
                label={i18n.t("reset")}
                onPress={resetFilters}
                style={styles.modalButton}
              />
              <PrimaryButton
                label={i18n.t("apply_filters")}
                onPress={applyFilters}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      {showFromPicker &&
        (Platform.OS === "ios" ? (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showFromPicker}
            onRequestClose={() => setShowFromPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.datePickerContent}>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity onPress={() => setShowFromPicker(false)}>
                    <AppText style={styles.doneButtonText}>
                      {i18n.t("done")}
                    </AppText>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempFromDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleFromDateChange}
                  textColor={colors.textPrimary}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={tempFromDate || new Date()}
            mode="date"
            display="default"
            onChange={handleFromDateChange}
          />
        ))}

      {showToPicker &&
        (Platform.OS === "ios" ? (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showToPicker}
            onRequestClose={() => setShowToPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.datePickerContent}>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity onPress={() => setShowToPicker(false)}>
                    <AppText style={styles.doneButtonText}>
                      {i18n.t("done")}
                    </AppText>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempToDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleToDateChange}
                  textColor={colors.textPrimary}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={tempToDate || new Date()}
            mode="date"
            display="default"
            onChange={handleToDateChange}
          />
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
  },
  searchContainer: {
    flexDirection: "row",
    gap: spacing.s,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.s,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.xs,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  modalBody: {
    padding: spacing.m,
  },
  filterSection: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.m,
  },
  dateInput: {
    flex: 1,
    position: "relative",
  },
  clearDate: {
    position: "absolute",
    right: 8,
    top: 38, // Adjusted based on TextField height
    zIndex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    padding: spacing.m,
    gap: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingBottom: Platform.OS === "ios" ? spacing.xl : spacing.m,
  },
  modalButton: {
    flex: 1,
  },
  datePickerContent: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
  },
  doneButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
