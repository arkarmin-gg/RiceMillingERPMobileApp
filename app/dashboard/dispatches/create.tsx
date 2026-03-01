import { SelectField } from "@/components/ui/select-field";
import {
  AppText,
  PrimaryButton,
  Screen,
  SecondaryButton,
  TextField,
} from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useCreateDispatch } from "@/hooks/use-dispatches";
import { useDispatchableParties } from "@/hooks/use-parties";
import { useToastActions } from "@/hooks/use-toast";
import { CreateDispatchRequest } from "@/types/dispatch";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  item_id: string;
  bags: string;
  loose_lb: string;
}

export default function CreateDispatchPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateDispatch();
  const { show } = useToastActions();

  // Fetch dispatchable parties
  const { data: dispatchablePartiesData } = useDispatchableParties();

  const merchantOptions =
    dispatchablePartiesData?.data.map((m) => ({
      label: m.full_name,
      value: m.id,
    })) || [];

  const toLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fromLocalDateString = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [formData, setFormData] = useState({
    merchant_id: "",
    dispatch_date: toLocalDateString(new Date()),
    description: "",
  });

  const [items, setItems] = useState<ItemForm[]>([
    { item_id: "", bags: "", loose_lb: "" },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Get selected merchant's dispatchable items
  const selectedMerchant = dispatchablePartiesData?.data.find(
    (p) => p.id === formData.merchant_id,
  );

  const itemOptions =
    selectedMerchant?.dispatchable_items.map((i) => ({
      label: i.item_name,
      value: i.item_id,
    })) || [];

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
        const dispatchableItem = selectedMerchant?.dispatchable_items.find(
          (di) => di.item_id === item.item_id,
        );

        if (dispatchableItem) {
          const bags = Number(item.bags);
          const looseLb = Number(item.loose_lb);

          if (bags > dispatchableItem.bags) {
            newErrors[`items.${index}.bags`] =
              `Max ${dispatchableItem.bags} bags`;
            hasError = true;
          }

          if (looseLb > dispatchableItem.loose_lb) {
            newErrors[`items.${index}.loose_lb`] =
              `Max ${dispatchableItem.loose_lb} lb`;
            hasError = true;
          }
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

    const payload: CreateDispatchRequest = {
      merchant_id: formData.merchant_id,
      dispatch_date: formData.dispatch_date,
      description: formData.description || "",
      status: "COMPLETED",
      items: items.map((i) => ({
        item_id: i.item_id,
        bags: Number(i.bags),
        loose_lb: Number(i.loose_lb),
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        show({
          type: "success",
          title: "Dispatch created successfully",
        });
        router.back();
      },
      onError: (error: any) => {
        show({
          type: "error",
          title: "Failed to create dispatch",
          message: error?.message || "Unknown error",
        });
      },
    });
  };

  const addItem = () => {
    setItems([...items, { item_id: "", bags: "", loose_lb: "" }]);
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

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: "New Dispatch",
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
              label="Merchant"
              placeholder="Select Merchant"
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
                  label="Dispatch Date"
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
                          <AppText style={styles.doneButtonText}>Done</AppText>
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
              label="Description"
              placeholder="Enter description"
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              error={errors.description}
            />

            <View style={styles.sectionHeader}>
              <AppText variant="h2" style={styles.sectionTitle}>
                Items
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

              return (
                <View key={index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <AppText variant="body" style={styles.itemIndex}>
                      Item {index + 1}
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
                    label="Item"
                    placeholder="Select Item"
                    value={item.item_id}
                    options={availableOptions}
                    onChange={(value) => updateItem(index, "item_id", value)}
                    error={errors[`items.${index}.item_id`]}
                  />

                  {/* Show available balance */}
                  {item.item_id && selectedMerchant && (
                    <AppText
                      variant="caption"
                      style={{
                        color: colors.textSecondary,
                        marginBottom: spacing.xs,
                      }}
                    >
                      Available:{" "}
                      {
                        selectedMerchant.dispatchable_items.find(
                          (di) => di.item_id === item.item_id,
                        )?.bags
                      }{" "}
                      bags,{" "}
                      {
                        selectedMerchant.dispatchable_items.find(
                          (di) => di.item_id === item.item_id,
                        )?.loose_lb
                      }{" "}
                      lb
                    </AppText>
                  )}

                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <TextField
                        label="Bags"
                        placeholder="0"
                        value={item.bags}
                        onChangeText={(text) => updateItem(index, "bags", text)}
                        keyboardType="numeric"
                        error={errors[`items.${index}.bags`]}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <TextField
                        label="Loose (lb)"
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
              label="Add Item"
              onPress={addItem}
              style={styles.addButton}
              rightIcon={
                <Ionicons name="add" size={18} color={colors.primary} />
              }
            />

            <PrimaryButton
              label={isPending ? "Creating..." : "Create Dispatch"}
              onPress={handleSubmit}
              disabled={isPending}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 12, // radii.card
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
    paddingBottom: spacing["2xl"], // Safe area padding
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
