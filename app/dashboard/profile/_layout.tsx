import { CustomHeader } from "@/components/ui/custom-header";
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
              title="Profile"
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
              title="Edit Profile"
              showBack
              onLeftPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
