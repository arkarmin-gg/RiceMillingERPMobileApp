import { AppText } from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
      </View>
      <View style={styles.infoContent}>
        <AppText variant="caption" style={styles.infoLabel}>
          {label}
        </AppText>
        <AppText variant="body" style={styles.infoValue}>
          {value}
        </AppText>
      </View>
    </View>
  );
};

export default InfoRow;

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.m,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    color: colors.textPrimary,
  },
});
