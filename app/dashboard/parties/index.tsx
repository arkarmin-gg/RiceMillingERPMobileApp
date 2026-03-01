import PartyItem from "@/components/parties/party-item";
import {
  AppText,
  IconButton,
  Screen,
  TextField,
} from "@/design-system/components";
import { colors, radii, spacing } from "@/design-system/tokens";
import { useDebounce } from "@/hooks/use-debounce";
import { useParties } from "@/hooks/use-parties";
import { PartyType } from "@/types/party";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
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

  // Fetching
  const { data, isLoading, refetch } = useParties({
    get_all: true,
    search: debouncedSearch,
    type: selectedType,
  });

  const renderContent = () => {
    if (isLoading && !data) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!data?.data?.length) {
      return (
        <View style={styles.center}>
          <AppText variant="h2" style={{ color: colors.textSecondary }}>
            No parties found
          </AppText>
        </View>
      );
    }

    return (
      <FlatList
        data={data.data}
        renderItem={({ item }) => (
          <PartyItem
            party={item}
            onPress={() =>
              router.push({
                pathname: "/dashboard/parties/detail",
                params: { partyId: item.id },
              })
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <TextField
          placeholder="Search parties..."
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
          <Pressable
            onPress={() => setSelectedType(undefined)}
            style={[styles.chip, !selectedType && styles.chipSelected]}
          >
            <AppText
              style={[
                styles.chipText,
                !selectedType && styles.chipTextSelected,
              ]}
            >
              All
            </AppText>
          </Pressable>
          {(["MERCHANT", "FARMER", "BROKER", "CUSTOMER"] as PartyType[]).map(
            (type) => (
              <Pressable
                key={type}
                onPress={() => setSelectedType(type)}
                style={[
                  styles.chip,
                  selectedType === type && styles.chipSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.chipText,
                    selectedType === type && styles.chipTextSelected,
                  ]}
                >
                  {type}
                </AppText>
              </Pressable>
            ),
          )}
        </ScrollView>
      </View>

      {renderContent()}

      <IconButton
        icon={<Ionicons name="add" size={32} color="white" />}
        variant="primary"
        size="large"
        style={styles.fab}
        onPress={() => router.push("/dashboard/parties/create")}
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
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontWeight: "500",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    gap: spacing.s,
    paddingTop: spacing.s,
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
