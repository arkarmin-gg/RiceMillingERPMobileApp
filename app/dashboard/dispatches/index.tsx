import DispatchItem from "@/components/dispatch/dispatch-item";
import { SelectField } from "@/components/ui/select-field";
import {
  AppText,
  IconButton,
  Screen,
  TextField,
} from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useDebounce } from "@/hooks/use-debounce";
import { useDispatches } from "@/hooks/use-dispatches";
import { useParties } from "@/hooks/use-parties";
import { DispatchStatus } from "@/types/dispatch";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const STATUSES: DispatchStatus[] = ["PENDING", "COMPLETED", "CANCELLED"];

export default function DispatchesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    DispatchStatus | undefined
  >();
  const [merchantId, setMerchantId] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Temporary filter states for modal
  const [tempMerchantId, setTempMerchantId] = useState("");
  const [tempFromDate, setTempFromDate] = useState<Date | undefined>();
  const [tempToDate, setTempToDate] = useState<Date | undefined>();

  const debouncedSearch = useDebounce(search, 500);

  // Calculate active filters count
  const activeFiltersCount = [merchantId, fromDate, toDate].filter(
    Boolean,
  ).length;

  // Initialize temp filters when opening modal
  const openFilterModal = () => {
    setTempMerchantId(merchantId);
    setTempFromDate(fromDate);
    setTempToDate(toDate);
    setIsFilterModalVisible(true);
  };

  const applyFilters = () => {
    setMerchantId(tempMerchantId);
    setFromDate(tempFromDate);
    setToDate(tempToDate);
    setIsFilterModalVisible(false);
  };

  const resetFilters = () => {
    setTempMerchantId("");
    setTempFromDate(undefined);
    setTempToDate(undefined);
  };

  // Fetch Merchants
  const { data: merchantsData } = useParties({
    get_all: true,
  });

  const merchantOptions = [
    { label: "All Merchants", value: "" },
    ...(merchantsData?.data.map((m) => ({
      label: m.full_name,
      value: m.id,
    })) || []),
  ];

  const toLocalDateString = (date?: Date) => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFromDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowFromPicker(false);
    if (selectedDate) setTempFromDate(selectedDate);
  };

  const handleToDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowToPicker(false);
    if (selectedDate) setTempToDate(selectedDate);
  };

  // Fetching
  const { data, isLoading, refetch } = useDispatches({
    get_all: true,
    search: debouncedSearch,
    merchant_id: merchantId || undefined,
    from_date: toLocalDateString(fromDate),
    to_date: toLocalDateString(toDate),
    status: selectedStatus,
  });

  const renderContent = () => {
    if (isLoading && !data) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!data?.data?.length) {
      return (
        <View style={styles.center}>
          <AppText variant="h2" style={{ color: colors.textSecondary }}>
            No dispatches found
          </AppText>
        </View>
      );
    }

    return (
      <FlatList
        data={data.data}
        renderItem={({ item }) => (
          <DispatchItem
            dispatch={item}
            onPress={() =>
              router.push({
                pathname: "/dashboard/dispatches/detail",
                params: { id: item.id },
              })
            }
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={{ flex: 1 }}>
            <TextField
              placeholder="Search dispatches..."
              value={search}
              onChangeText={setSearch}
              leftIcon={
                <Ionicons
                  name="search"
                  size={20}
                  color={colors.textSecondary}
                />
              }
              rightIcon={
                search ? (
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.textSecondary}
                  />
                ) : undefined
              }
              onRightIconPress={() => setSearch("")}
            />
          </View>
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
          </TouchableOpacity>
        </View>
      </View>

      {renderContent()}

      <IconButton
        icon={<Ionicons name="add" size={32} color="white" />}
        variant="primary"
        size="large"
        style={styles.fab}
        onPress={() => router.push("/dashboard/dispatches/create")}
      />

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
              <AppText variant="h2">Filters</AppText>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.filterSection}>
                <SelectField
                  label="Merchant"
                  placeholder="All Merchants"
                  value={tempMerchantId}
                  options={merchantOptions}
                  onChange={setTempMerchantId}
                />
              </View>

              <View style={styles.filterSection}>
                <AppText variant="bodySecondary" style={styles.sectionLabel}>
                  Date Range
                </AppText>
                <View style={styles.dateRow}>
                  <View style={styles.dateInput}>
                    <TouchableOpacity onPress={() => setShowFromPicker(true)}>
                      <View pointerEvents="none">
                        <TextField
                          label="From Date"
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
                          label="To Date"
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
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <AppText style={styles.resetButtonText}>Reset</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <AppText style={styles.applyButtonText}>Show Results</AppText>
              </TouchableOpacity>
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
                  <TouchableOpacity onPress={() => setShowFromPicker(false)}>
                    <AppText style={styles.doneButtonText}>Done</AppText>
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
                  <TouchableOpacity onPress={() => setShowToPicker(false)}>
                    <AppText style={styles.doneButtonText}>Done</AppText>
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
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.l,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    paddingBottom: spacing.s,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.s,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  filterContainer: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    gap: spacing.s,
  },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginRight: spacing.s,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontWeight: "500",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  modalBody: {
    padding: spacing.m,
  },
  filterSection: {
    marginBottom: spacing.l,
  },
  sectionLabel: {
    marginBottom: spacing.xs,
  },
  modalFooter: {
    flexDirection: "row",
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    gap: spacing.m,
  },
  resetButton: {
    flex: 1,
    padding: spacing.m,
    borderRadius: radii.button,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  resetButtonText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: radii.button,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  datePickerContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    paddingBottom: spacing["2xl"],
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
    right: 40,
    top: 36,
    zIndex: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    gap: spacing.s,
    paddingTop: spacing.s,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    paddingBottom: spacing["2xl"],
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  doneButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
