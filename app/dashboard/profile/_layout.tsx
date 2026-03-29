import { CustomHeader } from "@/components/ui/custom-header";
import i18n from "@/config/i18n";
import { Stack, useRouter } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <CustomHeader
              title={i18n.t("profile")}
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          header: () => (
            <CustomHeader
              title={`${i18n.t("edit")} ${i18n.t("profile")}`}
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
