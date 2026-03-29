import { CustomHeader } from "@/components/ui/custom-header";
import i18n from "@/config/i18n";
import { colors } from "@/design-system/tokens";
import { Stack, useRouter } from "expo-router";
import React from "react";

export default function ProductionLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <CustomHeader title={i18n.t("production_batches")} />,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          header: () => (
            <CustomHeader
              title={i18n.t("create_new_batch")}
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
