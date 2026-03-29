import { CustomHeader } from "@/components/ui/custom-header";
import i18n from "@/config/i18n";
import { colors } from "@/design-system/tokens";
import { Stack, useRouter } from "expo-router";
import React from "react";

export default function PartiesLayout() {
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
          header: () => <CustomHeader title={i18n.t("parties")} />,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          header: () => (
            <CustomHeader
              title={i18n.t("create_new_party")}
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
