import PartyAvatar from "@/components/parties/party-avatar";
import { CustomHeader } from "@/components/ui/custom-header";
import InfoRow from "@/components/ui/info-row";
import { AppText, Screen } from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useParty } from "@/hooks/use-parties";
import { PartyType } from "@/types/party";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const BADGE_STYLES: Record<
  PartyType,
  { bg: string; text: string; label: string }
> = {
  MERCHANT: { bg: "#DBEAFE", text: "#1E40AF", label: "MERCHANT" },
  FARMER: { bg: "#DCFCE7", text: "#15803D", label: "FARMER" },
  BROKER: { bg: "#F3E8FF", text: "#7E22CE", label: "BROKER" },
  CUSTOMER: { bg: "#FCE7F3", text: "#BE185D", label: "CUSTOMER" },
};

const DetailPartyPage = () => {
  const router = useRouter();
  const { partyId } = useLocalSearchParams<{ partyId: string }>();
  const { data: partyResponse, isLoading } = useParty(partyId);
  const party = partyResponse?.data;

  if (isLoading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  if (!party) {
    return (
      <Screen style={styles.center}>
        <AppText>Party not found</AppText>
      </Screen>
    );
  }

  const badgeStyle = BADGE_STYLES[party.type];

  return (
    <Screen style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={`${party.full_name}'s Details`}
              showBack
              onLeftPress={() => router.back()}
              rightIcon={
                <Ionicons name="pencil" size={24} color={colors.primary} />
              }
              onRightPress={() =>
                router.push({
                  pathname: "/dashboard/parties/edit",
                  params: { partyId: party.id },
                })
              }
            />
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <PartyAvatar party={party} size={120} />

          <AppText variant="h1" style={styles.name}>
            {party.full_name}
          </AppText>

          <View style={[styles.roleBadge, { backgroundColor: badgeStyle.bg }]}>
            <AppText
              variant="caption"
              style={{ color: badgeStyle.text, fontWeight: "700" }}
            >
              {badgeStyle.label}
            </AppText>
          </View>
        </View>

        <View style={styles.infoSection}>
          <InfoRow icon="call-outline" label="Phone" value={party.phone} />
          <InfoRow
            icon="location-outline"
            label="Address"
            value={party.address}
          />
          <InfoRow icon="card-outline" label="NRC" value={party.nrc} />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  name: {
    marginTop: spacing.m,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  roleBadge: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    gap: spacing.m,
  },
});

export default DetailPartyPage;
