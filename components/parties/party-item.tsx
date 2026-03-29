import { AppText } from "@/design-system/components";
import { colors, radii, shadows, spacing } from "@/design-system/tokens";
import { Party, PartyType } from "@/types/party";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import PartyAvatar from "./party-avatar";

interface PartyItemProps {
  party: Party;
  onPress: () => void;
}

const BADGE_STYLES: Record<
  PartyType,
  { bg: string; text: string; label: string }
> = {
  MERCHANT: { bg: "#DBEAFE", text: "#1E40AF", label: "MERCHANT" },
  FARMER: { bg: "#DCFCE7", text: "#15803D", label: "FARMER" },
  BROKER: { bg: "#F3E8FF", text: "#7E22CE", label: "BROKER" },
  CUSTOMER: { bg: "#F1F5F9", text: "#475569", label: "CUSTOMER" },
};

export default function PartyItem({ party, onPress }: PartyItemProps) {
  const badgeStyle = BADGE_STYLES[party.type];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <PartyAvatar party={party} />
      {/* Content */}
      <View style={styles.content}>
        <AppText style={styles.name} numberOfLines={1}>
          {party.full_name}
        </AppText>
        <View style={styles.row}>
          <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
            <AppText
              style={[
                styles.badgeText,
                { color: badgeStyle.text, fontSize: 10, fontWeight: "700" },
              ]}
            >
              {badgeStyle.label}
            </AppText>
          </View>
          <AppText
            variant="caption"
            style={{ color: colors.textSecondary, marginLeft: spacing.s }}
          >
            {party.phone}
          </AppText>
        </View>
      </View>

      {/* Arrow */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textSecondary}
        style={{ opacity: 0.5 }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    marginBottom: spacing.m,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  containerPressed: {
    backgroundColor: colors.background,
    transform: [{ scale: 0.98 }],
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  content: {
    flex: 1,
    marginLeft: spacing.m,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    textTransform: "uppercase",
  },
});
