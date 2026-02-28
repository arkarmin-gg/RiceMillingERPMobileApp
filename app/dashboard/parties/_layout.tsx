import { CustomHeader } from "@/components/ui/custom-header";
import { colors } from "@/design-system/tokens";
import { Ionicons } from "@expo/vector-icons";
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
          header: () => (
            <CustomHeader
              title="Parties List"
              rightIcon={
                <Ionicons
                  name="person-add-outline"
                  size={24}
                  color={colors.primary}
                />
              }
              onRightPress={() => router.push("/dashboard/parties/create")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          header: () => (
            <CustomHeader
              title="Create New Party"
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
