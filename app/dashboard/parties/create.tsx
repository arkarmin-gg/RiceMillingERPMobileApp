import i18n from "@/config/i18n";
import {
  AppText,
  PrimaryButton,
  Screen,
  TextField,
} from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useCreateParty } from "@/hooks/use-parties";
import { useToastActions } from "@/hooks/use-toast";
import { CreatePartyInput, PartyType } from "@/types/party";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { z } from "zod";

const partySchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  type: z.enum(["MERCHANT", "FARMER", "BROKER", "CUSTOMER"]),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  nrc: z.string().min(1, "NRC is required"),
});

export default function CreateNewPartiesPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateParty();
  const { show } = useToastActions();

  const [formData, setFormData] = useState<CreatePartyInput>({
    full_name: "",
    type: "MERCHANT",
    phone: "",
    address: "",
    nrc: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePartyInput, string>>
  >({});

  const validate = () => {
    const result = partySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    mutate(formData, {
      onSuccess: () => {
        show({ type: "success", title: "Party created successfully" });
        router.back();
      },
      onError: (error: any) => {
        show({
          type: "error",
          title: "Failed to create party",
          message: error?.message || "Unknown error",
        });
      },
    });
  };

  const handleChange = (field: keyof CreatePartyInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView>
          <View style={styles.form}>
            <TextField
              label={i18n.t("full_name")}
              placeholder="e.g. Jonathon Jacobi"
              value={formData.full_name}
              onChangeText={(text) => handleChange("full_name", text)}
              error={errors.full_name}
              autoCapitalize="words"
            />

            <View style={styles.fieldContainer}>
              <AppText variant="bodySecondary" style={styles.fieldLabel}>
                {i18n.t("party_type")}
              </AppText>
              <View style={styles.chipContainer}>
                {(
                  ["MERCHANT", "FARMER", "BROKER", "CUSTOMER"] as PartyType[]
                ).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => {
                      setFormData((prev) => ({ ...prev, type }));
                      if (errors.type)
                        setErrors((prev) => ({ ...prev, type: undefined }));
                    }}
                    style={[
                      styles.chip,
                      formData.type === type && styles.chipSelected,
                    ]}
                  >
                    <AppText
                      style={[
                        styles.chipText,
                        formData.type === type && styles.chipTextSelected,
                      ]}
                    >
                      {type}
                    </AppText>
                  </Pressable>
                ))}
              </View>
              {errors.type ? (
                <AppText variant="caption" style={styles.fieldError}>
                  {errors.type}
                </AppText>
              ) : null}
            </View>

            <TextField
              label={i18n.t("phone")}
              placeholder="e.g. 09123456789"
              value={formData.phone}
              onChangeText={(text) => handleChange("phone", text)}
              error={errors.phone}
              keyboardType="phone-pad"
            />

            <TextField
              label={i18n.t("address")}
              placeholder="e.g. 123 Main St"
              value={formData.address}
              onChangeText={(text) => handleChange("address", text)}
              error={errors.address}
              multiline
              numberOfLines={3}
            />

            <TextField
              label="NRC"
              placeholder="e.g. 12/PaKaNa(N)1124411"
              value={formData.nrc}
              onChangeText={(text) => handleChange("nrc", text)}
              error={errors.nrc}
              autoCapitalize="characters"
            />

            <PrimaryButton
              label={isPending ? i18n.t("loading") : i18n.t("create_new_party")}
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
  title: {
    marginBottom: spacing.l,
  },
  form: {
    gap: spacing.s,
  },
  fieldContainer: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.label,
    marginBottom: 4,
  },
  fieldError: {
    color: colors.danger,
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.s,
  },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
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
    color: "#FFFFFF",
  },
  submitButton: {
    marginTop: spacing.s,
  },
});
