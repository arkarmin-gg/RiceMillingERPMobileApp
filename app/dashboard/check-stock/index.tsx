import { StockBalanceList } from "@/components/check-stock/stock-balance-list";
import { SelectField } from "@/components/ui/select-field";
import i18n from "@/config/i18n";
import {
  AppText,
  EmptyState,
  ListSkeleton,
  PrimaryButton,
  Screen,
  SecondaryButton,
  TextField,
} from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useDebounce } from "@/hooks/use-debounce";
import { useParties } from "@/hooks/use-parties";
import { useStockBalances } from "@/hooks/use-stock-balances";
import { ItemCategory } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function CheckStockIndex() {
  const [search, setSearch] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [itemCategory, setItemCategory] = useState<ItemCategory | "">("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Temporary filter states for modal
  const [tempOwnerId, setTempOwnerId] = useState("");
  const [tempItemCategory, setTempItemCategory] = useState<ItemCategory | "">(
    "",
  );

  const debouncedSearch = useDebounce(search, 500);

  // Calculate active filters count
  const activeFiltersCount = [ownerId, itemCategory].filter(Boolean).length;

  // Initialize temp filters when opening modal
  const openFilterModal = () => {
    setTempOwnerId(ownerId);
    setTempItemCategory(itemCategory);
    setIsFilterModalVisible(true);
  };

  const applyFilters = () => {
    setOwnerId(tempOwnerId);
    setItemCategory(tempItemCategory);
    setIsFilterModalVisible(false);
  };

  const resetFilters = () => {
    setTempOwnerId("");
    setTempItemCategory("");
  };

  // Fetch Parties for filter
  const { data: partiesData } = useParties({
    get_all: true,
  });

  const ownerOptions = [
    { label: i18n.t("all_merchants"), value: "" },
    ...(partiesData?.data.map((p) => ({
      label: p.full_name,
      value: p.id,
    })) || []),
  ];

  const categoryOptions = [
    { label: "All Categories", value: "" },
    { label: "Paddy", value: "PADDY" },
    { label: "Rice", value: "RICE" },
    { label: "Broken", value: "BROKEN" },
    { label: "Point Broken", value: "POINT_BROKEN" },
    { label: "Bran", value: "BRAN" },
    { label: "Point Bran", value: "POINT_BRAN" },
    { label: "Husk", value: "HUSK" },
    { label: "Wasted", value: "WASTED" },
  ];

  const {
    data: stockBalancesData,
    isLoading,
    error,
    refetch,
  } = useStockBalances({
    search: debouncedSearch || undefined,
    owner_id: ownerId || undefined,
    item_category: (itemCategory as ItemCategory) || undefined,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderContent = () => {
    if (isLoading && !stockBalancesData) {
      return <ListSkeleton />;
    }

    if (error) {
      return (
        <View style={styles.center}>
          <AppText variant="body" style={{ color: colors.danger }}>
            {i18n.t("failed_to_load_data")}
          </AppText>
          <AppText variant="caption" style={{ marginTop: 8 }}>
            {error?.message}
          </AppText>
        </View>
      );
    }

    const balances = stockBalancesData?.data || [];

    if (!balances.length) {
      return (
        <EmptyState
          icon="clipboard-outline"
          title={i18n.t("no_items_found")}
          description="Try adjusting your filters or wait for stock to be added."
        />
      );
    }

    return (
      <StockBalanceList
        balances={balances}
        isLoading={isLoading}
        onRefresh={onRefresh}
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
              placeholder={i18n.t("search_items")}
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
                  label={i18n.t("merchant")}
                  placeholder={i18n.t("all_merchants")}
                  value={tempOwnerId}
                  options={ownerOptions}
                  onChange={setTempOwnerId}
                />
              </View>

              <View style={styles.filterSection}>
                <SelectField
                  label="Category"
                  placeholder="All Categories"
                  value={tempItemCategory}
                  options={categoryOptions}
                  onChange={(value) =>
                    setTempItemCategory(value as ItemCategory | "")
                  }
                />
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
    paddingBottom: spacing.m,
  },
  searchContainer: {
    flexDirection: "row",
    gap: spacing.s,
    alignItems: "flex-start",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.surface,
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
  modalFooter: {
    flexDirection: "row",
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    gap: spacing.m,
  },
  modalButton: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
