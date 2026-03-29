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
import { useItems } from "@/hooks/use-items";
import { useParties } from "@/hooks/use-parties";
import {
  useProductionBatch,
  useUpdateProductionBatch,
} from "@/hooks/use-production-batches";
import { useToastActions } from "@/hooks/use-toast";
import { UpdateProductionBatchRequest } from "@/types/production-batch";
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

const getBatchSchema = () => {
  const outputSchema = z.object({
    item_id: z.string().min(1, i18n.t("validation_item_required")),
    bags: z
      .string()
      .regex(/^\d+$/, i18n.t("validation_must_be_number"))
      .transform(Number)
      .refine((val) => val > 0, i18n.t("validation_must_be_greater_than_zero")),
    loose_lb: z
      .string()
      .regex(/^\d+(\.\d+)?$/, i18n.t("validation_must_be_number"))
      .transform(Number),
  });

  return z.object({
    merchant_id: z.string().min(1, i18n.t("validation_merchant_required")),
    production_date: z.string().min(1, i18n.t("validation_date_required")),
    outputs: z
      .array(outputSchema)
      .min(1, i18n.t("validation_at_least_one_item")),
  });
};

interface OutputForm {
  id?: string;
  item_id: string;
  bags: string;
  loose_lb: string;
}

export default function EditProductionBatchPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: batchResponse, isLoading: isLoadingBatch } =
    useProductionBatch(id);
  const { mutate, isPending: isUpdating } = useUpdateProductionBatch();
  const { show } = useToastActions();

  // Fetch data for selectors
  const { data: merchantsData } = useParties({
    get_all: true,
  });

  const { data: itemsData } = useItems({
    get_all: true,
  });

  const merchantOptions =
    merchantsData?.data.map((m) => ({
      label: m.full_name,
      value: m.id,
    })) || [];

  const itemOptions =
    itemsData?.data.map((i) => ({
      label: i.name,
      value: i.id,
    })) || [];

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

  const [formData, setFormData] = useState({
    merchant_id: "",
    production_date: "",
  });

  const [outputs, setOutputs] = useState<OutputForm[]>([
    { item_id: "", bags: "", loose_lb: "" },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useFocusEffect(
    useCallback(() => {
      if (batchResponse?.data) {
        const batch = batchResponse.data;
        // Convert API date (likely ISO) to YYYY-MM-DD
        // Assuming batch.production_date is "YYYY-MM-DD" or ISO string
        let dateStr = batch.production_date;
        if (dateStr.includes("T")) {
          dateStr = dateStr.split("T")[0];
        }

        setFormData({
          merchant_id: batch.merchant_id,
          production_date: dateStr,
        });

        setOutputs(
          batch.outputs.map((o) => ({
            id: o.id,
            item_id: o.item_id,
            bags: o.bags.toString(),
            loose_lb: o.loose_lb.toString(),
          })),
        );

        // Clear errors and date picker state
        setErrors({});
        setShowDatePicker(false);
      }
    }, [batchResponse]),
  );

  const validate = () => {
    try {
      getBatchSchema().parse({
        ...formData,
        outputs,
      });
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

    const payload: UpdateProductionBatchRequest = {
      id,
      merchant_id: formData.merchant_id,
      production_date: formData.production_date,
      outputs: outputs.map((o) => ({
        id: o.id,
        item_id: o.item_id,
        bags: Number(o.bags),
        loose_lb: Number(o.loose_lb),
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        show({
          type: "success",
          title: i18n.t("batch_update_success"),
        });
        router.back();
      },
      onError: (error: any) => {
        show({
          type: "error",
          title: i18n.t("batch_update_failed"),
          message: error?.message || i18n.t("unknown_error"),
        });
      },
    });
  };

  const addOutput = () => {
    setOutputs([...outputs, { item_id: "", bags: "", loose_lb: "" }]);
  };

  const removeOutput = (index: number) => {
    if (outputs.length > 1) {
      const newOutputs = [...outputs];
      newOutputs.splice(index, 1);
      setOutputs(newOutputs);
    }
  };

  const updateOutput = (
    index: number,
    field: keyof OutputForm,
    value: string,
  ) => {
    const newOutputs = [...outputs];
    newOutputs[index] = { ...newOutputs[index], [field]: value };
    setOutputs(newOutputs);

    // Clear error for this field if it exists
    const errorKey = `outputs.${index}.${field}`;
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
      setFormData((prev) => ({ ...prev, production_date: dateString }));
      if (errors.production_date) {
        setErrors((prev: any) => ({
          ...prev,
          production_date: undefined,
        }));
      }
    }
  };

  if (isLoadingBatch) {
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
          title: `${i18n.t("edit")} ${i18n.t("production_batch")}`,
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
                  label={i18n.t("production_date")}
                  placeholder="YYYY-MM-DD"
                  value={formData.production_date}
                  editable={false}
                  error={errors.production_date}
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
                        value={fromLocalDateString(formData.production_date)}
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
                  value={fromLocalDateString(formData.production_date)}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              ))}

            <View style={styles.sectionHeader}>
              <AppText variant="h2" style={styles.sectionTitle}>
                {i18n.t("items")}
              </AppText>
            </View>

            {outputs.map((output, index) => {
              // Get IDs selected in other rows to filter them out
              const otherSelectedIds = outputs
                .filter((_, i) => i !== index)
                .map((o) => o.item_id)
                .filter((id) => id !== "");

              const availableOptions = itemOptions.filter(
                (opt) => !otherSelectedIds.includes(opt.value),
              );

              return (
                <View key={index} style={styles.outputCard}>
                  <View style={styles.outputHeader}>
                    <AppText variant="body" style={styles.outputIndex}>
                      {i18n.t("item")} {index + 1}
                    </AppText>
                    {outputs.length > 1 && (
                      <TouchableOpacity onPress={() => removeOutput(index)}>
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
                    value={output.item_id}
                    options={availableOptions}
                    onChange={(value) => updateOutput(index, "item_id", value)}
                    error={errors[`outputs.${index}.item_id`]}
                  />

                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <TextField
                        label={i18n.t("bags")}
                        placeholder="0"
                        value={output.bags}
                        onChangeText={(text) =>
                          updateOutput(index, "bags", text)
                        }
                        keyboardType="numeric"
                        error={errors[`outputs.${index}.bags`]}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <TextField
                        label={i18n.t("loose_lb")}
                        placeholder="0.0"
                        value={output.loose_lb}
                        onChangeText={(text) =>
                          updateOutput(index, "loose_lb", text)
                        }
                        keyboardType="numeric"
                        error={errors[`outputs.${index}.loose_lb`]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}

            <SecondaryButton
              label={i18n.t("add_item")}
              onPress={addOutput}
              style={styles.addButton}
              rightIcon={
                <Ionicons name="add" size={18} color={colors.primary} />
              }
            />

            <PrimaryButton
              label={isUpdating ? i18n.t("loading") : i18n.t("update")}
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
  outputCard: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.m,
  },
  outputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  outputIndex: {
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
