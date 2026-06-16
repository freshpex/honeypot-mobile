import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const MealsScreen = () => {
  const categories = useMemo(
    () => ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Smoothies"],
    [],
  );
  const diets = useMemo(
    () => ["High Protein", "Low Carb", "Weight Loss", "Vegetarian", "Vegan", "Keto"],
    [],
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDiet, setActiveDiet] = useState<string>();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Browse our healthy meals</Text>

        <View style={styles.searchBox}>
          <Ionicons color="#8A847F" name="search-outline" size={15} />
          <TextInput
            placeholder="Search meals..."
            placeholderTextColor="#8A847F"
            selectionColor="#C8320D"
            style={styles.searchInput}
          />
        </View>

        <FilterStrip
          activeValue={activeCategory}
          items={categories}
          onChange={setActiveCategory}
          primary
        />
        <FilterStrip activeValue={activeDiet} items={diets} onChange={setActiveDiet} />

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No meals found</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

type FilterStripProps = {
  activeValue?: string;
  items: string[];
  onChange: (value: string) => void;
  primary?: boolean;
};

const FilterStrip = ({ activeValue, items, onChange, primary }: FilterStripProps) => (
  <View style={styles.filterBlock}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
    >
      {items.map((item) => {
        const isActive = activeValue === item;
        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[
              styles.chip,
              isActive && (primary ? styles.activePrimaryChip : styles.activeOutlineChip),
            ]}
          >
            <Text
              style={[
                styles.chipText,
                isActive && (primary ? styles.activePrimaryText : styles.activeOutlineText),
              ]}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
    <View style={styles.scrollHint}>
      <Ionicons color="#9B9691" name="caret-back" size={11} />
      <View style={styles.scrollTrack} />
      <Ionicons color="#9B9691" name="caret-forward" size={11} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  activeOutlineChip: {
    backgroundColor: "#FFE8DF",
    borderColor: "#FF4A17",
  },
  activeOutlineText: {
    color: "#FF4A17",
  },
  activePrimaryChip: {
    backgroundColor: "#FF4A17",
    borderColor: "#FF4A17",
  },
  activePrimaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  chip: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#DDD8D3",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 27,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  chipRow: {
    gap: 8,
    paddingRight: 18,
  },
  chipText: {
    color: "#706A65",
    fontSize: 11,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 112,
  },
  emptyText: {
    color: "#8B8580",
    fontSize: 14,
  },
  filterBlock: {
    marginTop: 10,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  scrollHint: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    height: 15,
    marginTop: 2,
  },
  scrollTrack: {
    backgroundColor: "#96928E",
    borderRadius: 4,
    flex: 1,
    height: 8,
    maxWidth: 226,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#DDD8D3",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 9,
    height: 33,
    marginTop: 12,
    paddingHorizontal: 13,
  },
  searchInput: {
    color: "#171513",
    flex: 1,
    fontSize: 12,
    padding: 0,
  },
  subtitle: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 3,
  },
  title: {
    color: "#171513",
    fontSize: 20,
    fontWeight: "800",
  },
});

