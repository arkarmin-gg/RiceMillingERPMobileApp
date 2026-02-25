import { AppText } from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useToastStore } from "@/hooks/use-toast";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ToastHost() {
  const { visible, type, title, message, hide } = useToastStore();

  React.useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(hide, 4000);
    return () => clearTimeout(timeout);
  }, [visible, hide, title, message, type]);

  if (!visible) {
    return null;
  }

  const palette =
    type === "success"
      ? {
          background: colors.success,
          icon: "checkmark-circle-outline" as const,
        }
      : type === "error"
        ? { background: colors.danger, icon: "alert-circle-outline" as const }
        : {
            background: colors.primary,
            icon: "information-circle-outline" as const,
          };

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <View style={styles.iconContainer}>
          <Ionicons name={palette.icon} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <AppText
            variant="body"
            style={{
              color: "#FFFFFF",
            }}
          >
            {title}
          </AppText>
          {message ? (
            <AppText
              variant="bodySecondary"
              style={{
                color: "#FFFFFF",
              }}
            >
              {message}
            </AppText>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.l,
  },
  container: {
    borderRadius: radii.card,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: spacing.s,
  },
  textContainer: {
    flex: 1,
  },
});
