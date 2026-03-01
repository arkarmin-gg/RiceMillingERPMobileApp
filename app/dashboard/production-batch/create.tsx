import { SelectField } from "@/components/ui/select-field";
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
import { useCreateProductionBatch } from "@/hooks/use-production-batches";
import { useToastActions } from "@/hooks/use-toast";
import { CreateProductionBatchRequest } from "@/types/production-batch";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
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

const outputSchema = z.object({
  item_id: z.string().min(1, "Item is required"),
  bags: z.string().regex(/^\d+$/, "Must be a number").transform(Number),
  loose_lb: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Must be a number")
    .transform(Number),
});

const batchSchema = z.object({
  merchant_id: z.string().min(1, "Merchant is required"),
  production_date: z.string().min(1, "Date is required"),
  outputs: z.array(outputSchema).min(1, "At least one output item is required"),
});

interface OutputForm {
  item_id: string;
  bags: string;
  loose_lb: string;
}

export default function CreateNewProductionBatchPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateProductionBatch();
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
    production_date: toLocalDateString(new Date()),
  });

  const [outputs, setOutputs] = useState<OutputForm[]>([
    { item_id: "", bags: "", loose_lb: "" },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    try {
      batchSchema.parse({
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

    const payload: CreateProductionBatchRequest = {
      merchant_id: formData.merchant_id,
      production_date: formData.production_date,
      status: "COMPLETED",
      outputs: outputs.map((o) => ({
        item_id: o.item_id,
        bags: Number(o.bags),
        loose_lb: Number(o.loose_lb),
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        show({
          type: "success",
          title: "Production Batch created successfully",
        });
        router.back();
      },
      onError: (error: any) => {
        show({
          type: "error",
          title: "Failed to create batch",
          message: error?.message || "Unknown error",
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

  return (
    <Screen>
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
                  label="Production Date"
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
                          <AppText style={styles.doneButtonText}>Done</AppText>
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
                Outputs
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
                      Item {index + 1}
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
                    label="Item"
                    placeholder="Select Item"
                    value={output.item_id}
                    options={availableOptions}
                    onChange={(value) => updateOutput(index, "item_id", value)}
                    error={errors[`outputs.${index}.item_id`]}
                  />

                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <TextField
                        label="Bags"
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
                        label="Loose (lb)"
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
              label="Add Item"
              onPress={addOutput}
              style={styles.addButton}
              rightIcon={
                <Ionicons name="add" size={18} color={colors.primary} />
              }
            />

            <PrimaryButton
              label={isPending ? "Creating..." : "Create Batch"}
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
  title: {
    marginBottom: spacing.l,
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
    borderRadius: 12, // radii.card
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
