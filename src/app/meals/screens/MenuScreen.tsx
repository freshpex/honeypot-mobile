import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import {
  formatNaira,
  getCartItemCount,
  getCartSubtotal,
  useMealCartStore,
} from "@/shared/state";
import { skeuo } from "@/shared/theme";
import type { Meal, MealsStackParamList } from "../types";

type MenuScreenProps = NativeStackScreenProps<MealsStackParamList, "Menu">;

const meals: Meal[] = [
  {
    id: "avocado-toast-eggs",
    name: "Avocado Toast & Eggs",
    category: "Breakfast",
    description: "Whole grain toast topped with smashed avocado, poached eggs...",
    detailDescription:
      "Whole grain toast topped with smashed avocado, poached eggs and chilli flakes",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    calories: 380,
    protein: 18,
    carbs: 28,
    fat: 22,
    price: 2800,
    tags: ["vegetarian"],
  },
  {
    id: "fresh-fruit-bowl",
    name: "Fresh Fruit Bowl",
    category: "Breakfast",
    description: "Seasonal fresh fruits with granola, yogurt and a drizzle of raw honey",
    detailDescription:
      "Seasonal fresh fruits with granola, yogurt and a drizzle of raw honey",
    imageUrl:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80",
    calories: 250,
    protein: 8,
    carbs: 39,
    fat: 8,
    price: 1800,
    tags: ["vegetarian", "weight loss"],
  },
  {
    id: "green-detox-smoothie",
    name: "Green Detox Smoothie",
    category: "Smoothies",
    description: "Fresh spinach, banana, ginger, apple and lemon blended to perfection",
    detailDescription:
      "Fresh spinach, banana, ginger, apple and lemon blended to perfection",
    imageUrl:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80",
    calories: 180,
    protein: 5,
    carbs: 34,
    fat: 3,
    price: 1500,
    tags: ["vegan", "weight loss"],
  },
  {
    id: "grilled-chicken-vegetables",
    name: "Grilled Chicken & Vegetables",
    category: "Lunch",
    description: "Juicy grilled chicken breast served with seasonal roasted vegetables...",
    detailDescription:
      "Juicy grilled chicken breast served with seasonal roasted vegetables and lemon",
    imageUrl:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80",
    calories: 420,
    protein: 34,
    carbs: 20,
    fat: 18,
    price: 3500,
    tags: ["high protein", "low carb"],
  },
];

export const MenuScreen = ({ navigation }: MenuScreenProps) => {
  const addMeal = useMealCartStore((state) => state.addMeal);
  const cartItems = useMealCartStore((state) => state.items);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDiet, setActiveDiet] = useState<string>();
  const [selectedMeal, setSelectedMeal] = useState<Meal>();
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Smoothies"],
    [],
  );
  const diets = useMemo(
    () => ["High Protein", "Low Carb", "Weight Loss", "Vegetarian", "Vegan", "Keto"],
    [],
  );
  const filteredMeals = useMemo(
    () =>
      meals.filter((meal) => {
        const matchesCategory = activeCategory === "All" || meal.category === activeCategory;
        const matchesDiet =
          !activeDiet || meal.tags.includes(activeDiet.toLowerCase() as Meal["tags"][number]);
        const matchesSearch = meal.name.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesDiet && matchesSearch;
      }),
    [activeCategory, activeDiet, query],
  );
  const cartCount = useMemo(() => getCartItemCount(cartItems), [cartItems]);
  const subtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems]);
  const mealPagination = usePagination(filteredMeals);

  const openMeal = (meal: Meal) => {
    setDetailQuantity(1);
    setSelectedMeal(meal);
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.searchBox}>
          <Ionicons color="#8A847F" name="search-outline" size={15} />
          <TextInput
            onChangeText={setQuery}
            placeholder="Search meals..."
            placeholderTextColor="#8A847F"
            selectionColor="#C8320D"
            style={styles.searchInput}
            value={query}
          />
        </View>

        <FilterStrip
          activeValue={activeCategory}
          items={categories}
          onChange={setActiveCategory}
          primary
        />
        <FilterStrip activeValue={activeDiet} items={diets} onChange={setActiveDiet} />

        <ScrollView
          contentContainerStyle={[styles.mealGrid, cartCount > 0 && styles.mealGridWithCart]}
          showsVerticalScrollIndicator={false}
        >
          {mealPagination.pageItems.map((meal) => (
            <MealCard key={meal.id} meal={meal} onPress={() => openMeal(meal)} />
          ))}
          <View style={styles.paginationWide}>
            <PaginationControls
              canGoNext={mealPagination.canGoNext}
              canGoPrevious={mealPagination.canGoPrevious}
              onNext={mealPagination.goNext}
              onPrevious={mealPagination.goPrevious}
              page={mealPagination.page}
              totalPages={mealPagination.totalPages}
            />
          </View>
        </ScrollView>

        {cartCount > 0 ? (
          <CartBar
            count={cartCount}
            label="View cart"
            onPress={() => navigation.navigate("Cart")}
            total={subtotal}
          />
        ) : null}
      </View>

      <MealDetailSheet
        meal={selectedMeal}
        onAdd={() => {
          if (selectedMeal) {
            addMeal(selectedMeal, detailQuantity);
            setSelectedMeal(undefined);
          }
        }}
        onClose={() => setSelectedMeal(undefined)}
        onDecrement={() => setDetailQuantity((value) => Math.max(1, value - 1))}
        onIncrement={() => setDetailQuantity((value) => value + 1)}
        quantity={detailQuantity}
      />
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
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

const MealCard = ({ meal, onPress }: { meal: Meal; onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.mealCard}>
    <View>
      <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
      <View style={styles.tagRow}>
        {meal.tags.slice(0, 2).map((tag) => (
          <Text key={tag} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
    </View>
    <View style={styles.mealBody}>
      <Text numberOfLines={1} style={styles.mealName}>
        {meal.name}
      </Text>
      <Text numberOfLines={2} style={styles.mealDescription}>
        {meal.description}
      </Text>
      <View style={styles.mealMetaRow}>
        <Text style={styles.metaText}>{meal.calories} cal</Text>
        <Text style={styles.metaText}>{meal.protein}g protein</Text>
        <Text style={styles.mealPrice}>{formatNaira(meal.price)}</Text>
      </View>
    </View>
  </Pressable>
);

type MealDetailSheetProps = {
  meal?: Meal;
  onAdd: () => void;
  onClose: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  quantity: number;
};

const MealDetailSheet = ({
  meal,
  onAdd,
  onClose,
  onDecrement,
  onIncrement,
  quantity,
}: MealDetailSheetProps) => {
  const insets = useSafeAreaInsets();

  return (
  <Modal animationType="slide" onRequestClose={onClose} transparent visible={Boolean(meal)}>
    <View style={styles.detailOverlay}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
      {meal ? (
        <View style={[styles.detailSheet, { paddingBottom: Math.max(insets.bottom + 18, 28) }]}>
          <Image source={{ uri: meal.imageUrl }} style={styles.detailImage} />
          <View style={styles.detailBody}>
            <View style={styles.detailTitleRow}>
              <View>
                <Text style={styles.detailTitle}>{meal.name}</Text>
                <Text style={styles.detailCategory}>{meal.category}</Text>
              </View>
              <Text style={styles.detailPrice}>{formatNaira(meal.price)}</Text>
            </View>
            <Text style={styles.detailDescription}>{meal.detailDescription}</Text>
            <View style={styles.nutritionRow}>
              <NutritionCard icon="flame-outline" label="Calories" value={`${meal.calories}kcal`} />
              <NutritionCard icon="barbell-outline" label="Protein" value={`${meal.protein}g`} />
              <NutritionCard icon="leaf-outline" label="Carbs" value={`${meal.carbs}g`} />
              <NutritionCard icon="water-outline" label="Fat" value={`${meal.fat}g`} />
            </View>
            <Text style={styles.detailTag}>{meal.tags[0]}</Text>
            <View style={styles.detailFooter}>
              <View style={styles.quantityControl}>
                <Pressable onPress={onDecrement} style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>−</Text>
                </Pressable>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Pressable onPress={onIncrement} style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>
              <Pressable onPress={onAdd} style={styles.addButton}>
                <Ionicons color="#FFFFFF" name="cart-outline" size={14} />
                <Text style={styles.addButtonText}>
                  Add to Cart — {formatNaira(meal.price * quantity)}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  </Modal>
  );
};

const NutritionCard = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.nutritionCard}>
    <Ionicons color="#FF4A17" name={icon} size={15} />
    <Text style={styles.nutritionValue}>{value}</Text>
    <Text style={styles.nutritionLabel}>{label}</Text>
  </View>
);

export const CartBar = ({
  count,
  label,
  onPress,
  total,
}: {
  count: number;
  label: string;
  onPress: () => void;
  total: number;
}) => {
  const insets = useSafeAreaInsets();

  return (
  <Pressable onPress={onPress} style={[styles.cartBar, { bottom: Math.max(insets.bottom + 10, 10) }]}>
    <View style={styles.cartBarLeft}>
      <View style={styles.cartIconBubble}>
        <Ionicons color="#FFFFFF" name="cart-outline" size={18} />
      </View>
      <View>
        <Text style={styles.cartCount}>{count} {count === 1 ? "item" : "items"}</Text>
        <Text style={styles.cartLabel}>{label}</Text>
      </View>
    </View>
    <Text style={styles.cartTotal}>{formatNaira(total)}</Text>
  </Pressable>
  );
};

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
  addButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 19,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 38,
    justifyContent: "center",
    ...skeuo.action,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  cartBar: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 9,
    flexDirection: "row",
    height: 53,
    justifyContent: "space-between",
    left: 15,
    paddingHorizontal: 13,
    position: "absolute",
    right: 15,
    shadowColor: "#FF4A17",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  cartBarLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  cartCount: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  cartIconBubble: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  cartLabel: {
    color: "#FFE7DF",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 1,
  },
  cartTotal: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  chip: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#DDD8D3",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    height: 27,
    justifyContent: "center",
    paddingHorizontal: 15,
    ...skeuo.pressed,
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
    paddingTop: 4,
  },
  detailBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  detailCategory: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 4,
  },
  detailDescription: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 13,
    marginTop: 17,
  },
  detailFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
  },
  detailImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 202,
    width: "100%",
  },
  detailOverlay: {
    backgroundColor: "rgba(0,0,0,0.76)",
    flex: 1,
    justifyContent: "flex-end",
  },
  detailPrice: {
    color: "#FF4A17",
    fontSize: 15,
    fontWeight: "900",
  },
  detailSheet: {
    backgroundColor: "#FAF9F8",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 14,
    paddingBottom: 17,
    ...skeuo.floating,
  },
  detailTag: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2DDD8",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    color: "#171513",
    fontSize: 9,
    fontWeight: "600",
    marginTop: 12,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  detailTitle: {
    color: "#171513",
    fontSize: 15,
    fontWeight: "900",
  },
  detailTitleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterBlock: {
    marginTop: 10,
  },
  mealBody: {
    padding: 10,
  },
  mealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 5,
    overflow: "hidden",
    width: "48.5%",
    ...skeuo.card,
  },
  mealDescription: {
    color: "#817B75",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 5,
    minHeight: 28,
  },
  mealGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 18,
    paddingTop: 12,
  },
  mealGridWithCart: {
    paddingBottom: 78,
  },
  mealImage: {
    height: 124,
    width: "100%",
  },
  mealMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  mealName: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
  },
  mealPrice: {
    color: "#FF4A17",
    flex: 1,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right",
  },
  metaText: {
    color: "#8B8580",
    fontSize: 9,
  },
  nutritionCard: {
    alignItems: "center",
    backgroundColor: "#F5F2EF",
    borderRadius: 7,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 2,
    height: 52,
    justifyContent: "center",
    width: "23%",
    ...skeuo.pressed,
  },
  nutritionLabel: {
    color: "#817B75",
    fontSize: 7,
    marginTop: 2,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nutritionValue: {
    color: "#171513",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 3,
  },
  paginationWide: {
    width: "100%",
  },
  quantityButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 30,
  },
  quantityButtonText: {
    color: "#817B75",
    fontSize: 15,
    fontWeight: "800",
  },
  quantityControl: {
    alignItems: "center",
    backgroundColor: "#F1EFED",
    borderRadius: 16,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 32,
    justifyContent: "space-between",
    width: 99,
    ...skeuo.pressed,
  },
  quantityText: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
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
    elevation: 3,
    flexDirection: "row",
    gap: 9,
    height: 33,
    marginTop: 12,
    paddingHorizontal: 13,
    ...skeuo.card,
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
  tag: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 8,
    color: "#171513",
    fontSize: 8,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  tagRow: {
    flexDirection: "row",
    gap: 4,
    left: 7,
    position: "absolute",
    top: 7,
  },
  title: {
    color: "#171513",
    fontSize: 20,
    fontWeight: "800",
  },
});
