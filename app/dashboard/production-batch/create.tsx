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
import { useItems } from "@/hooks/use-items";
import { useParties } from "@/hooks/use-parties";
import { useCreateProductionBatch } from "@/hooks/use-production-batches";
import { useToastActions } from "@/hooks/use-toast";
import { CreateProductionBatchRequest } from "@/types/production-batch";
import { toLocalDateString } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
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
  id: string;
  item_id: string;
  bags: string;
  loose_lb: string;
}

function makeOutput(): OutputForm {
  return { id: Math.random().toString(36).slice(2), item_id: "", bags: "", loose_lb: "0.0" };
}

export default function CreateNewProductionBatchPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateProductionBatch();
  const { show } = useToastActions();

  const { data: merchantsData } = useParties({ get_all: true });
  const { data: itemsData } = useItems({ get_all: true });

  const merchantOptions =
    merchantsData?.data.map((m) => ({ label: m.full_name, value: m.id })) ?? [];

  const itemOptions =
    itemsData?.data.map((i) => ({ label: i.name, value: i.id })) ?? [];

  const [formData, setFormData] = useState({
    merchant_id: "",
    production_date: toLocalDateString(new Date()),
  });

  const [outputs, setOutputs] = useState<OutputForm[]>([makeOutput()]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useFocusEffect(
    useCallback(() => {
      setFormData({
        merchant_id: "",
        production_date: toLocalDateString(new Date()),
      });
      setOutputs([makeOutput()]);
      setErrors({});
    }, []),
  );

  const validate = () => {
    try {
      batchSchema.parse({ ...formData, outputs });
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
        show({ type: "success", title: "Production Batch created successfully" });
        router.back();
      },
      onError: (error: Error) => {
        show({
          type: "error",
          title: "Failed to create batch",
          message: error.message,
        });
      },
    });
  };

  const addOutput = () => setOutputs((prev) => [...prev, makeOutput()]);

  const removeOutput = (id: string) => {
    if (outputs.length > 1) {
      setOutputs((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const updateOutput = (id: string, field: keyof Omit<OutputForm, "id">, value: string) => {
    setOutputs((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
    );
    const index = outputs.findIndex((o) => o.id === id);
    const errorKey = `outputs.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  // Compute once per render, not per output row
  const selectedItemIds = new Set(outputs.map((o) => o.item_id).filter(Boolean));

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
                  setErrors((prev) => ({ ...prev, merchant_id: undefined }));
                }
              }}
              error={errors.merchant_id}
            />

            <DatePickerField
              label="Production Date"
              value={formData.production_date}
              onChange={(dateString) => {
                setFormData((prev) => ({ ...prev, production_date: dateString }));
                if (errors.production_date) {
                  setErrors((prev) => ({ ...prev, production_date: undefined }));
                }
              }}
              error={errors.production_date}
            />

            <View style={styles.sectionHeader}>
              <AppText variant="h2" style={styles.sectionTitle}>
                Outputs
              </AppText>
            </View>

            {outputs.map((output, index) => {
              const availableOptions = itemOptions.filter(
                (opt) => opt.value === output.item_id || !selectedItemIds.has(opt.value),
              );

              return (
                <View key={output.id} style={styles.outputCard}>
                  <View style={styles.outputHeader}>
                    <AppText variant="body" style={styles.outputIndex}>
                      Item {index + 1}
                    </AppText>
                    {outputs.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeOutput(output.id)}
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
                    value={output.item_id}
                    options={availableOptions}
                    onChange={(value) => updateOutput(output.id, "item_id", value)}
                    error={errors[`outputs.${index}.item_id`]}
                  />

                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <TextField
                        label="Bags"
                        placeholder="0"
                        value={output.bags}
                        onChangeText={(text) => updateOutput(output.id, "bags", text)}
                        keyboardType="numeric"
                        error={errors[`outputs.${index}.bags`]}
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <TextField
                        label="Loose (lb)"
                        placeholder="0.0"
                        value={output.loose_lb}
                        onChangeText={(text) => updateOutput(output.id, "loose_lb", text)}
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
              rightIcon={<Ionicons name="add" size={18} color={colors.primary} />}
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
});
