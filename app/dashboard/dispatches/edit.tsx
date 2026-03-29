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
import { useDispatch, useUpdateDispatch } from "@/hooks/use-dispatches";
import { useDispatchableParties } from "@/hooks/use-parties";
import { useToastActions } from "@/hooks/use-toast";
import { UpdateDispatchRequest } from "@/types/dispatch";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const itemSchema = z.object({
  item_id: z.string().min(1, "Item is required"),
  bags: z.string().regex(/^\d+$/, "Must be a number").transform(Number),
  loose_lb: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Must be a number")
    .transform(Number),
});

const dispatchSchema = z.object({
  merchant_id: z.string().min(1, "Merchant is required"),
  dispatch_date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

interface ItemForm {
  id?: string;
  item_id: string;
  bags: string;
  loose_lb: string;
}

export default function EditDispatchPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: dispatchResponse, isLoading: isLoadingDispatch } =
    useDispatch(id);
  const { mutate, isPending: isUpdating } = useUpdateDispatch();
  const { show } = useToastActions();

  // State declarations moved up
  const [formData, setFormData] = useState({
    merchant_id: "",
    dispatch_date: "",
    description: "",
  });

  const [items, setItems] = useState<ItemForm[]>([
    { item_id: "", bags: "", loose_lb: "" },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Fetch data for selectors
  const { data: dispatchablePartiesData } = useDispatchableParties();

  // Merge current merchant into options if not present in dispatchable list
  const merchantOptions = React.useMemo(() => {
    const options =
      dispatchablePartiesData?.data.map((m) => ({
        label: m.full_name,
        value: m.id,
      })) || [];

    if (dispatchResponse?.data) {
      const currentMerchantId = dispatchResponse.data.merchant_id;
      const exists = options.find((o) => o.value === currentMerchantId);

      if (!exists) {
        options.push({
          label: dispatchResponse.data.merchant_name,
          value: currentMerchantId,
        });
      }
    }
    return options;
  }, [dispatchablePartiesData, dispatchResponse]);

  // Get selected merchant's dispatchable items
  const selectedMerchant = dispatchablePartiesData?.data.find(
    (p) => p.id === formData.merchant_id,
  );

  // Construct item options merging available dispatchable items and current dispatch items
  const itemOptions = React.useMemo(() => {
    const options: { label: string; value: string }[] = [];
    const seenIds = new Set<string>();

    // 1. Add items from the selected merchant's available list
    if (selectedMerchant) {
      selectedMerchant.dispatchable_items.forEach((i) => {
        options.push({ label: i.item_name, value: i.item_id });
        seenIds.add(i.item_id);
      });
    }

    // 2. If we are on the original merchant, ensure original items are included
    if (
      dispatchResponse?.data &&
      formData.merchant_id === dispatchResponse.data.merchant_id
    ) {
      dispatchResponse.data.items.forEach((i) => {
        if (!seenIds.has(i.item_id)) {
          options.push({ label: i.item_name, value: i.item_id });
          seenIds.add(i.item_id);
        }
      });
    }

    return options;
  }, [selectedMerchant, dispatchResponse, formData.merchant_id]);

  const toLocalDateString = (date?: Date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fromLocalDateString = (dateString: string) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  useFocusEffect(
    useCallback(() => {
      if (dispatchResponse?.data) {
        const dispatch = dispatchResponse.data;
        // Convert API date (likely ISO) to YYYY-MM-DD
        let dateStr = dispatch.dispatch_date;
        if (dateStr.includes("T")) {
          dateStr = dateStr.split("T")[0];
        } else if (dateStr.includes(" ")) {
          dateStr = dateStr.split(" ")[0];
        }

        setFormData({
          merchant_id: dispatch.merchant_id,
          dispatch_date: dateStr,
          description: dispatch.description || "",
        });

        setItems(
          dispatch.items.map((i) => ({
            id: i.id,
            item_id: i.item_id,
            bags: i.bags.toString(),
            loose_lb: i.loose_lb.toString(),
          })),
        );

        setShowDatePicker(false);
        setErrors({});
      }
    }, [dispatchResponse]),
  );

  const validate = () => {
    try {
      dispatchSchema.parse({
        ...formData,
        items,
      });
      // Additional validation for quantities
      const newErrors: any = {};
      let hasError = false;

      items.forEach((item, index) => {
        // Find dispatchable item (current available balance)
        const dispatchableItem = selectedMerchant?.dispatchable_items.find(
          (di) => di.item_id === item.item_id,
        );

        // Find original item in this dispatch (to add back to balance)
        // Only if we are still editing the original merchant's dispatch
        const isOriginalMerchant =
          dispatchResponse?.data &&
          formData.merchant_id === dispatchResponse.data.merchant_id;

        const originalItem = isOriginalMerchant
          ? dispatchResponse?.data.items.find((i) => i.item_id === item.item_id)
          : null;

        const maxBags =
          (dispatchableItem?.bags || 0) + (originalItem?.bags || 0);
        const maxLooseLb =
          (dispatchableItem?.loose_lb || 0) + (originalItem?.loose_lb || 0);

        // If neither exists, it means item is invalid for this merchant
        if (!dispatchableItem && !originalItem) {
          // This might happen if user selects an item that is not in dispatchable list
          // But since we filter options, it shouldn't be selectable unless it was pre-filled
          // If it was pre-filled (original item), we have originalItem
          // So this case is rare or impossible unless data is inconsistent
        }

        const bags = Number(item.bags);
        const looseLb = Number(item.loose_lb);

        if (bags > maxBags) {
          newErrors[`items.${index}.bags`] =
            `Max ${maxBags} ${i18n.t("bags").toLowerCase()}`;
          hasError = true;
        }

        if (looseLb > maxLooseLb) {
          newErrors[`items.${index}.loose_lb`] = `Max ${maxLooseLb} lb`;
          hasError = true;
        }
      });

      if (hasError) {
        setErrors(newErrors);
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.issues.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload: UpdateDispatchRequest = {
      id,
      merchant_id: formData.merchant_id,
      dispatch_date: formData.dispatch_date,
      description: formData.description,
      items: items.map((i) => ({
        id: i.id, // Include ID for existing items
        item_id: i.item_id,
        bags: Number(i.bags),
        loose_lb: Number(i.loose_lb),
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        show({
          type: "success",
          title: `${i18n.t("dispatch")} ${i18n.t("update")} ${i18n.t("success")}`,
        });
        router.back();
      },
      onError: (error: any) => {
        show({
          type: "error",
          title: i18n.t("error"),
          message: error?.message || "Unknown error",
        });
      },
    });
  };

  const addItem = () => {
    setItems([...items, { item_id: "", bags: "", loose_lb: "0.0" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof ItemForm, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);

    // Clear error for this field if it exists
    const errorKey = `items.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const dateString = toLocalDateString(selectedDate);
      setFormData((prev) => ({ ...prev, dispatch_date: dateString }));
      if (errors.dispatch_date) {
        setErrors((prev: any) => ({
          ...prev,
          dispatch_date: undefined,
        }));
      }
    }
  };

  if (isLoadingDispatch) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: `${i18n.t("edit")} ${i18n.t("dispatch")}`,
          headerTitleAlign: "center",
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <SelectField
              label={i18n.t("merchant")}
              placeholder={i18n.t("merchant")}
              value={formData.merchant_id}
              options={merchantOptions}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, merchant_id: value }));
                if (errors.merchant_id) {
                  setErrors((prev: any) => ({
                    ...prev,
                    merchant_id: undefined,
                  }));
                }
              }}
              error={errors.merchant_id}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextField
                  label={i18n.t("dispatch_date")}
                  placeholder="YYYY-MM-DD"
                  value={formData.dispatch_date}
                  editable={false}
                  error={errors.dispatch_date}
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

            {showDatePicker &&
              (Platform.OS === "ios" ? (
                <Modal
                  transparent={true}
                  animationType="slide"
                  visible={showDatePicker}
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <AppText style={styles.doneButtonText}>
                            {i18n.t("done")}
                          </AppText>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={fromLocalDateString(formData.dispatch_date)}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        textColor={colors.textPrimary}
                      />
                    </View>
                  </View>
                </Modal>
              ) : (
                <DateTimePicker
                  value={fromLocalDateString(formData.dispatch_date)}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              ))}

            <TextField
              label={i18n.t("description")}
              placeholder={i18n.t("description")}
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              error={errors.description}
            />

            <View style={styles.sectionHeader}>
              <AppText variant="h2" style={styles.sectionTitle}>
                {i18n.t("items")}
              </AppText>
            </View>

            {items.map((item, index) => {
              // Get IDs selected in other rows to filter them out
              const otherSelectedIds = items
                .filter((_, i) => i !== index)
                .map((o) => o.item_id)
                .filter((id) => id !== "");

              const availableOptions = itemOptions.filter(
                (opt) => !otherSelectedIds.includes(opt.value),
              );

              // Calculate available balance for display
              const dispatchableItem =
                selectedMerchant?.dispatchable_items.find(
                  (di) => di.item_id === item.item_id,
                );

              const isOriginalMerchant =
                dispatchResponse?.data &&
                formData.merchant_id === dispatchResponse.data.merchant_id;

              const originalItem = isOriginalMerchant
                ? dispatchResponse?.data.items.find(
                    (i) => i.item_id === item.item_id,
                  )
                : null;

              const maxBags =
                (dispatchableItem?.bags || 0) + (originalItem?.bags || 0);
              const maxLooseLb =
                (dispatchableItem?.loose_lb || 0) +
                (originalItem?.loose_lb || 0);

              const hasSelection = !!item.item_id;

              return (
                <View key={index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <AppText variant="body" style={styles.itemIndex}>
                      {i18n.t("item")} {index + 1}
                    </AppText>
                    {items.length > 1 && (
                      <TouchableOpacity onPress={() => removeItem(index)}>
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={colors.danger}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <SelectField
                    label={i18n.t("item")}
                    placeholder={i18n.t("item")}
                    value={item.item_id}
                    options={availableOptions}
                    onChange={(value) => updateItem(index, "item_id", value)}
                    error={errors[`items.${index}.item_id`]}
                  />

                  {hasSelection && (
                    <View style={styles.availableBalance}>
                      <AppText
                        variant="caption"
                        style={styles.availableBalanceText}
                      >
                        Available: {maxBags} {i18n.t("bags").toLowerCase()},{" "}
                        {maxLooseLb} lb
                      </AppText>
                    </View>
                  )}

                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <TextField
                        label={i18n.t("bags")}
                        placeholder="0"
                        value={item.bags}
                        onChangeText={(text) => updateItem(index, "bags", text)}
                        keyboardType="numeric"
                        error={errors[`items.${index}.bags`]}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <TextField
                        label={i18n.t("loose_lb")}
                        placeholder="0.0"
                        value={item.loose_lb}
                        onChangeText={(text) =>
                          updateItem(index, "loose_lb", text)
                        }
                        keyboardType="numeric"
                        error={errors[`items.${index}.loose_lb`]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}

            <SecondaryButton
              label={i18n.t("add_item")}
              onPress={addItem}
              style={styles.addButton}
              rightIcon={
                <Ionicons name="add" size={18} color={colors.primary} />
              }
            />

            <PrimaryButton
              label={
                isUpdating
                  ? i18n.t("loading")
                  : `${i18n.t("update")} ${i18n.t("dispatch")}`
              }
              onPress={handleSubmit}
              disabled={isUpdating}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: spacing["2xl"],
  },
  form: {
    gap: spacing.m,
  },
  sectionHeader: {
    marginTop: spacing.s,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  itemCard: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.m,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  itemIndex: {
    fontWeight: "600",
    color: colors.textSecondary,
  },
  availableBalance: {
    marginTop: -spacing.s,
    marginBottom: spacing.xs,
  },
  availableBalanceText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    gap: spacing.m,
  },
  halfWidth: {
    flex: 1,
  },
  addButton: {
    marginTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.l,
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
    justifyContent: "flex-end",
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
