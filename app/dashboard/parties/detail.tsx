import { StockBalanceList } from "@/components/check-stock/stock-balance-list";
import PartyAvatar from "@/components/parties/party-avatar";
import { CustomHeader } from "@/components/ui/custom-header";
import InfoRow from "@/components/ui/info-row";
import i18n from "@/config/i18n";
import { AppText, Screen } from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useParty } from "@/hooks/use-parties";
import { useStockBalances } from "@/hooks/use-stock-balances";
import { PartyType } from "@/types/party";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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

  const {
    data: stockBalancesData,
    isLoading: isStockLoading,
    refetch: refetchStock,
  } = useStockBalances({
    owner_id: partyId,
  });

  const [activeTab, setActiveTab] = useState<"info" | "stock">("info");

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
        <AppText>{i18n.t("no_parties_found")}</AppText>
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
              title={`${party.full_name} ${i18n.t("details")}`}
              showBack
              onLeftPress={() => router.back()}
              rightIcon={
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={colors.primary}
                />
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

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "info" && styles.activeTab]}
            onPress={() => setActiveTab("info")}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === "info" && styles.activeTabText,
              ]}
            >
              {i18n.t("information")}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "stock" && styles.activeTab]}
            onPress={() => setActiveTab("stock")}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === "stock" && styles.activeTabText,
              ]}
            >
              {i18n.t("stock_balances")}
            </AppText>
          </TouchableOpacity>
        </View>

        {activeTab === "info" ? (
          <View style={styles.infoSection}>
            <InfoRow
              icon="call-outline"
              label={i18n.t("phone")}
              value={party.phone}
            />
            <InfoRow
              icon="location-outline"
              label={i18n.t("address")}
              value={party.address}
            />
            <InfoRow icon="card-outline" label="NRC" value={party.nrc} />
          </View>
        ) : (
          <View style={styles.stockSection}>
            {isStockLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <StockBalanceList
                balances={stockBalancesData?.data || []}
                isLoading={isStockLoading}
                onRefresh={refetchStock}
                hideOwner
                contentContainerStyle={{ paddingBottom: spacing.xl }}
              />
            )}
          </View>
        )}
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
    marginBottom: spacing.l,
    paddingTop: spacing.m,
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
  tabs: {
    flexDirection: "row",
    marginBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  tab: {
    paddingVertical: spacing.s,
    marginRight: spacing.l,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  activeTabText: {
    color: colors.primary,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.m,
    gap: spacing.m,
  },
  stockSection: {
    flex: 1,
  },
});

export default DetailPartyPage;
