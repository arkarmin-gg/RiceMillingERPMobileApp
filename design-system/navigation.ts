import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { colors } from "./tokens";

export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    fontWeight: "600",
    color: colors.textPrimary,
    fontSize: 17,
  },
  headerTitleAlign: "center",
  headerBackTitle: "", // Removes back button text on iOS
};

export const defaultTabOptions: BottomTabNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    fontWeight: "600",
    color: colors.textPrimary,
    fontSize: 17,
  },
  headerTitleAlign: "center",
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.navInactive,
  tabBarStyle: {
    borderTopColor: colors.navBorder,
    backgroundColor: colors.surface,
  },
};
