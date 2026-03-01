import { CustomHeader } from "@/components/ui/custom-header";
import { colors } from "@/design-system/tokens";
import { Stack, useRouter } from "expo-router";
import React from "react";

export default function DispatchesLayout() {
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
          header: () => <CustomHeader title="Dispatches" />,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          header: () => (
            <CustomHeader
              title="Create New Dispatch"
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
