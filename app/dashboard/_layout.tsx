import { CustomHeader } from "@/components/ui/custom-header";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function DashboardLayout() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          header: () => (
            <CustomHeader
              title="RiceMill ERP"
              titleAlign="left"
              rightIcon={
                <View style={styles.avatarContainer}>
                  <Image
                    source={
                      user?.profile_image_url ??
                      require("../../assets/images/react-logo.png")
                    }
                    style={styles.avatar}
                    contentFit="cover"
                  />
                </View>
              }
              onRightPress={() => router.push("/dashboard/profile")}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="parties"
        options={{
          title: "Parties",
          headerTitle: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
