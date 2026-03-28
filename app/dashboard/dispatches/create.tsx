import { DatePickerField } from "@/components/ui/date-picker-field";
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
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { toLocalDateString } from "@/utils/date";
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
  id: string;
  item_id: string;
  bags: string;
  loose_lb: string;
}

function makeItem(): ItemForm {
  return { id: Math.random().toString(36).slice(2), item_id: "", bags: "", loose_lb: "0.0" };
}

export default function CreateDispatchPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateDispatch();
  const { show } = useToastActions();

  const { data: dispatchablePartiesData } = useDispatchableParties();

  const merchantOptions =
    dispatchablePartiesData?.data.map((m) => ({
      label: m.full_name,
      value: m.id,
    })) ?? [];

  const [formData, setFormData] = useState({
    merchant_id: "",
    dispatch_date: toLocalDateString(new Date()),
    description: "",
  });

  const [items, setItems] = useState<ItemForm[]>([makeItem()]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useFocusEffect(
    useCallback(() => {
      setFormData({
        merchant_id: "",
        dispatch_date: toLocalDateString(new Date()),
        description: "",
      });
      setItems([makeItem()]);
      setErrors({});
    }, []),
  );

  const selectedMerchant = dispatchablePartiesData?.data.find(
    (p) => p.id === formData.merchant_id,
  );

  const itemOptions =
    selectedMerchant?.dispatchable_items.map((i) => ({
      label: i.item_name,
      value: i.item_id,
    })) ?? [];

  const validate = () => {
    try {
      dispatchSchema.parse({ ...formData, items });

      const newErrors: Record<string, string> = {};
      let hasError = false;

      items.forEach((item, index) => {
        const dispatchableItem = selectedMerchant?.dispatchable_items.find(
          (di) => di.item_id === item.item_id,
        );
        if (dispatchableItem) {
          if (Number(item.bags) > dispatchableItem.bags) {
            newErrors[`items.${index}.bags`] = `Max ${dispatchableItem.bags} bags`;
            hasError = true;
          }
          if (Number(item.loose_lb) > dispatchableItem.loose_lb) {
            newErrors[`items.${index}.loose_lb`] = `Max ${dispatchableItem.loose_lb} lb`;
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
        const fieldErrors: Record<string, string> = {};
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
        show({ type: "success", title: "Dispatch created successfully" });
        router.back();
      },
      onError: (error: Error) => {
        show({
          type: "error",
          title: "Failed to create dispatch",
          message: error.message,
        });
      },
    });
  };

  const addItem = () => setItems((prev) => [...prev, makeItem()]);

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof Omit<ItemForm, "id">, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
    const index = items.findIndex((item) => item.id === id);
    const errorKey = `items.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  // Compute once per render, not per item
  const selectedItemIds = new Set(items.map((i) => i.item_id).filter(Boolean));

  return (
    <Screen>
      <Stack.Screen
        options={{ title: "New Dispatch", headerTitleAlign: "center" }}
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
                  setErrors((prev) => ({ ...prev, merchant_id: undefined }));
                }
              }}
              error={errors.merchant_id}
            />

            <DatePickerField
              label="Dispatch Date"
              value={formData.dispatch_date}
              onChange={(dateString) => {
                setFormData((prev) => ({ ...prev, dispatch_date: dateString }));
                if (errors.dispatch_date) {
                  setErrors((prev) => ({ ...prev, dispatch_date: undefined }));
                }
              }}
              error={errors.dispatch_date}
            />

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
              const availableOptions = itemOptions.filter(
                (opt) => opt.value === item.item_id || !selectedItemIds.has(opt.value),
              );
              const dispatchableItem = selectedMerchant?.dispatchable_items.find(
                (di) => di.item_id === item.item_id,
              );

              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <AppText variant="body" style={styles.itemIndex}>
                      Item {index + 1}
                    </AppText>
                    {items.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeItem(item.id)}
                        accessibilityLabel={`Remove item ${index + 1}`}
                        accessibilityRole="button"
                      >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <SelectField
                    label="Item"
                    placeholder="Select Item"
                    value={item.item_id}
                    options={availableOptions}
                    onChange={(value) => updateItem(item.id, "item_id", value)}
                    error={errors[`items.${index}.item_id`]}
                  />

                  {item.item_id && dispatchableItem && (
                    <AppText
                      variant="caption"
                      style={{ color: colors.textSecondary, marginBottom: spacing.xs }}
                    >
                      Available: {dispatchableItem.bags} bags, {dispatchableItem.loose_lb} lb
                    </AppText>
                  )}

                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <TextField
                        label="Bags"
                        placeholder="0"
                        value={item.bags}
                        onChangeText={(text) => updateItem(item.id, "bags", text)}
                        keyboardType="numeric"
                        error={errors[`items.${index}.bags`]}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <TextField
                        label="Loose (lb)"
                        placeholder="0.0"
                        value={item.loose_lb}
                        onChangeText={(text) => updateItem(item.id, "loose_lb", text)}
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
              rightIcon={<Ionicons name="add" size={18} color={colors.primary} />}
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
});
