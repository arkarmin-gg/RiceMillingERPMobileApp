import { Stack } from "expo-router";
import React from "react";

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
