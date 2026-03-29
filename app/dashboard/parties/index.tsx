import PartyItem from "@/components/parties/party-item";
import i18n from "@/config/i18n";
import {
  Chip,
  EmptyState,
  IconButton,
  ListSkeleton,
  Screen,
  TextField,
} from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { useDebounce } from "@/hooks/use-debounce";
import { useParties } from "@/hooks/use-parties";
import { PARTY_TYPES, Party, PartyType } from "@/types/party";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function PartiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<PartyType | undefined>();
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, refetch } = useParties({
    get_all: true,
    search: debouncedSearch,
    type: selectedType,
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Party>) => (
      <PartyItem
        party={item}
        onPress={() =>
          router.push({
            pathname: "/dashboard/parties/detail",
            params: { partyId: item.id },
          })
        }
      />
    ),
    [router],
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <TextField
          placeholder={i18n.t("search_parties")}
          value={search}
          onChangeText={setSearch}
          leftIcon={
            <Ionicons name="search" size={20} color={colors.textSecondary} />
          }
          rightIcon={
            search ? (
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            ) : undefined
          }
          onRightIconPress={() => setSearch("")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <Chip
            label={i18n.t("all")}
            selected={!selectedType}
            onPress={() => setSelectedType(undefined)}
          />
          {PARTY_TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              selected={selectedType === type}
              onPress={() => setSelectedType(type)}
            />
          ))}
        </ScrollView>
      </View>

      {isLoading && !data ? (
        <ListSkeleton />
      ) : !data?.data?.length ? (
        <EmptyState
          icon="people-outline"
          title={i18n.t("no_parties_found")}
          description="Try adjusting your filters or create a new party."
        />
      ) : (
        <FlatList
          data={data.data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        />
      )}

      <IconButton
        icon={<Ionicons name="add" size={32} color="white" />}
        variant="primary"
        size="large"
        style={styles.fab}
        onPress={() => router.push("/dashboard/parties/create")}
        accessibilityLabel={i18n.t("create_new_party")}
        accessibilityRole="button"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: spacing.s,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    gap: spacing.s,
    paddingVertical: spacing.xs,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.l,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
