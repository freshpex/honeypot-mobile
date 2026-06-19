import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
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
import {
  formatNaira,
  getCartItemCount,
  getCartSubtotal,
  useMealCartStore,
} from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import { mealsService, type MealsMenuParams, type WeeklyMealSelection } from "../services";
import type { Meal, MealDetail, MealsStackParamList } from "../types";

type MenuScreenProps = NativeStackScreenProps<MealsStackParamList, "Menu">;

export const MenuScreen = ({ navigation }: MenuScreenProps) => {
  const addMeal = useMealCartStore((state) => state.addMeal);
  const cartItems = useMealCartStore((state) => state.items);
  const loadCart = useMealCartStore((state) => state.loadCart);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [menuError, setMenuError] = useState<string>();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDiet, setActiveDiet] = useState<string>();
  const [selectedMeal, setSelectedMeal] = useState<MealDetail>();
  const [activeSelection, setActiveSelection] = useState<WeeklyMealSelection>();
  const [weeklySelections, setWeeklySelections] = useState<WeeklyMealSelection[]>([]);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [selectionError, setSelectionError] = useState<string>();
  const [query, setQuery] = useState("");
  const [menuPage, setMenuPage] = useState(1);
  const [menuPagination, setMenuPagination] = useState({ page: 1, totalPages: 1 });
  const [sort, setSort] = useState<MealsMenuParams["sort"]>("name_asc");
  const [reviewError, setReviewError] = useState<string>();
  const [selectionActionDate, setSelectionActionDate] = useState<string>();
  const [detailActionLoading, setDetailActionLoading] = useState(false);

  const [categories, setCategories] = useState(["All"]);
  const [diets, setDiets] = useState<string[]>([]);
  const sortOptions = useMemo(
    () => [
      { label: "Name", value: "name_asc" },
      { label: "Price ↑", value: "price_asc" },
      { label: "Price ↓", value: "price_desc" },
      { label: "Rating", value: "rating_desc" },
      { label: "Newest", value: "newest" },
    ] satisfies Array<{ label: string; value: NonNullable<MealsMenuParams["sort"]> }>,
    [],
  );

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  useEffect(() => {
    let mounted = true;
    const loadFilters = async () => {
      try {
        const response = await mealsService.getFilters();
        if (mounted) {
          setCategories(["All", ...response.categories]);
          setDiets(response.tags.map((tag) => toTitleCase(tag)));
        }
      } catch (error) {
        if (mounted) {
          setMenuError(error instanceof Error ? error.message : "Unable to load meal filters.");
        }
      }
    };
    void loadFilters();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadMeals = async () => {
      try {
        const response = await mealsService.getMenu({
          category: activeCategory === "All" ? undefined : activeCategory,
          limit: 10,
          page: menuPage,
          q: query.trim() || undefined,
          sort,
          tag: activeDiet?.toLowerCase(),
        });
        if (mounted) {
          setMeals(response.meals);
          setMenuPagination({
            page: response.pagination?.page ?? menuPage,
            totalPages: response.pagination?.totalPages ?? 1,
          });
          setMenuError(undefined);
        }
      } catch (error) {
        if (mounted) {
          setMenuError(error instanceof Error ? error.message : "Unable to load meals.");
        }
      }
    };
    void loadMeals();
    return () => {
      mounted = false;
    };
  }, [activeCategory, activeDiet, menuPage, query, sort]);

  useEffect(() => {
    let mounted = true;
    const loadSelections = async () => {
      try {
        const response = await mealsService.getWeeklySelections();
        if (mounted) {
          setWeeklySelections(response);
          setSelectionError(undefined);
        }
      } catch (error) {
        if (mounted) {
          setSelectionError(error instanceof Error ? error.message : "Unable to load weekly plan.");
        }
      }
    };
    void loadSelections();
    return () => {
      mounted = false;
    };
  }, []);

  const cartCount = useMemo(() => getCartItemCount(cartItems), [cartItems]);
  const subtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems]);

  const openMeal = async (meal: Meal) => {
    setDetailQuantity(1);
    setReviewError(undefined);
    setSelectedMeal({ ...meal, reviews: [] });
    try {
      setSelectedMeal(await mealsService.getMeal(meal.id));
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : "Unable to load meal details.");
    }
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.searchBox}>
          <Ionicons color={resolveThemeColor("#8A847F")} name="search-outline" size={15} />
          <TextInput
            onChangeText={setQuery}
            placeholder="Search meals..."
            placeholderTextColor={resolveThemeColor("#8A847F")}
            selectionColor={resolveThemeColor("#C8320D")}
            style={styles.searchInput}
            value={query}
          />
        </View>

        <FilterStrip
          activeValue={activeCategory}
          items={categories}
          onChange={(value) => {
            setActiveCategory(value);
            setMenuPage(1);
          }}
          primary
        />
        <FilterStrip
          activeValue={activeDiet}
          items={diets}
          onChange={(value) => {
            setActiveDiet(value === activeDiet ? undefined : value);
            setMenuPage(1);
          }}
        />
        <SortStrip
          activeValue={sort}
          items={sortOptions}
          onChange={(value) => {
            setSort(value);
            setMenuPage(1);
          }}
        />
        <WeeklyPlanner
          error={selectionError}
          loadingDate={selectionActionDate}
          onChoose={(selection) => setActiveSelection(selection)}
          onSkip={async (selection) => {
            setSelectionActionDate(selection.date);
            try {
              const updated = await mealsService.skipMeal(selection.date, "Skipped from weekly menu");
              setWeeklySelections((current) =>
                current.map((item) => (item.date === updated.date ? updated : item)),
              );
            } catch (error) {
              setSelectionError(error instanceof Error ? error.message : "Unable to skip day.");
            } finally {
              setSelectionActionDate(undefined);
            }
          }}
          selections={weeklySelections}
        />

        <ScrollView
          contentContainerStyle={[styles.mealGrid, cartCount > 0 && styles.mealGridWithCart]}
          showsVerticalScrollIndicator={false}
        >
          {menuError ? <Text style={styles.errorText}>{menuError}</Text> : null}
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onPress={() => void openMeal(meal)} />
          ))}
          <View style={styles.paginationWide}>
            <PaginationControls
              canGoNext={menuPagination.page < menuPagination.totalPages}
              canGoPrevious={menuPagination.page > 1}
              onNext={() => setMenuPage((page) => page + 1)}
              onPrevious={() => setMenuPage((page) => Math.max(1, page - 1))}
              page={menuPagination.page}
              totalPages={menuPagination.totalPages}
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
        isSubmitting={detailActionLoading}
        meal={selectedMeal}
        onAdd={async () => {
          if (selectedMeal) {
            setDetailActionLoading(true);
            if (activeSelection) {
              try {
                const updated = await mealsService.selectMeal(activeSelection.date, selectedMeal.id);
                setWeeklySelections((current) =>
                  current.map((item) => (item.date === updated.date ? updated : item)),
                );
                setActiveSelection(undefined);
                setSelectedMeal(undefined);
              } catch (error) {
                setSelectionError(error instanceof Error ? error.message : "Unable to select meal.");
              } finally {
                setDetailActionLoading(false);
              }
            } else {
              try {
                await addMeal(selectedMeal, detailQuantity);
                setSelectedMeal(undefined);
              } finally {
                setDetailActionLoading(false);
              }
            }
          }
        }}
        onClose={() => setSelectedMeal(undefined)}
        onDecrement={() => setDetailQuantity((value) => Math.max(1, value - 1))}
        onIncrement={() => setDetailQuantity((value) => value + 1)}
        onReviewSubmit={async (payload) => {
          if (!selectedMeal) return;
          try {
            const review = await mealsService.createReview(selectedMeal.id, payload);
            setSelectedMeal((current) =>
              current ? { ...current, reviews: [review, ...current.reviews] } : current,
            );
            setReviewError(undefined);
          } catch (error) {
            setReviewError(error instanceof Error ? error.message : "Unable to submit review.");
          }
        }}
        quantity={detailQuantity}
        reviewError={reviewError}
        selectionLabel={activeSelection ? `Select for ${activeSelection.dayLabel}` : undefined}
      />
    </SafeAreaView>
  );
};

const WeeklyPlanner = ({
  error,
  loadingDate,
  onChoose,
  onSkip,
  selections,
}: {
  error?: string;
  loadingDate?: string;
  onChoose: (selection: WeeklyMealSelection) => void;
  onSkip: (selection: WeeklyMealSelection) => void;
  selections: WeeklyMealSelection[];
}) => {
  if (!selections.length && !error) {
    return null;
  }

  return (
    <View style={styles.weeklyPlanner}>
      <View style={styles.weeklyHeader}>
        <Text style={styles.weeklyTitle}>Weekly Meal Selection</Text>
        <Text style={styles.weeklyHint}>Choose before cutoff</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weeklyRow}>
        {selections.map((selection) => {
          const hasMeal = Boolean(selection.meal);
          const isSkipped = selection.status === "Skipped";
          const isLoading = loadingDate === selection.date;
          return (
            <View key={selection.date} style={[styles.dayCard, selection.locked && styles.dayCardLocked]}>
              <Text style={styles.dayLabel}>{selection.dayLabel}</Text>
              <Text numberOfLines={1} style={styles.dayMeal}>
                {hasMeal ? selection.meal?.name : isSkipped ? "Skipped" : "No meal"}
              </Text>
              <View style={styles.dayActions}>
                <Pressable
                  disabled={selection.locked || isLoading}
                  onPress={() => onChoose(selection)}
                  style={[styles.dayActionButton, (selection.locked || isLoading) && styles.dayActionDisabled]}
                >
                  <Text style={styles.dayActionText}>{isLoading ? "..." : hasMeal ? "Change" : "Choose"}</Text>
                </Pressable>
                <Pressable
                  disabled={selection.locked || isLoading}
                  onPress={() => onSkip(selection)}
                  style={[styles.daySkipButton, (selection.locked || isLoading) && styles.dayActionDisabled]}
                >
                  <Text style={styles.daySkipText}>{isLoading ? "..." : "Skip"}</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
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
      <Ionicons color={resolveThemeColor("#9B9691")} name="caret-back" size={11} />
      <View style={styles.scrollTrack} />
      <Ionicons color={resolveThemeColor("#9B9691")} name="caret-forward" size={11} />
    </View>
  </View>
);

type SortStripProps = {
  activeValue?: MealsMenuParams["sort"];
  items: Array<{ label: string; value: NonNullable<MealsMenuParams["sort"]> }>;
  onChange: (value: NonNullable<MealsMenuParams["sort"]>) => void;
};

const SortStrip = ({ activeValue, items, onChange }: SortStripProps) => (
  <View style={styles.filterBlock}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      {items.map((item) => {
        const isActive = activeValue === item.value;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.chip, isActive && styles.activeOutlineChip]}
          >
            <Text style={[styles.chipText, isActive && styles.activeOutlineText]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
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
  isSubmitting?: boolean;
  meal?: MealDetail;
  onAdd: () => void | Promise<void>;
  onClose: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onReviewSubmit: (payload: { body: string; rating: number; title: string }) => Promise<void>;
  quantity: number;
  reviewError?: string;
  selectionLabel?: string;
};

const MealDetailSheet = ({
  isSubmitting,
  meal,
  onAdd,
  onClose,
  onDecrement,
  onIncrement,
  onReviewSubmit,
  quantity,
  reviewError,
  selectionLabel,
}: MealDetailSheetProps) => {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  const submitReview = async () => {
    if (!reviewTitle.trim() || !reviewBody.trim()) return;
    setSavingReview(true);
    try {
      await onReviewSubmit({ body: reviewBody.trim(), rating, title: reviewTitle.trim() });
      setReviewTitle("");
      setReviewBody("");
      setRating(5);
    } finally {
      setSavingReview(false);
    }
  };

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
            <Text style={styles.ratingSummary}>
              ★ {meal.averageRating?.toFixed(1) ?? "0.0"} · {meal.reviewCount ?? meal.reviews?.length ?? 0} reviews
            </Text>
            <Text style={styles.detailDescription}>{meal.detailDescription}</Text>
            <View style={styles.nutritionRow}>
              <NutritionCard icon="flame-outline" label="Calories" value={`${meal.calories}kcal`} />
              <NutritionCard icon="barbell-outline" label="Protein" value={`${meal.protein}g`} />
              <NutritionCard icon="leaf-outline" label="Carbs" value={`${meal.carbs}g`} />
              <NutritionCard icon="water-outline" label="Fat" value={`${meal.fat}g`} />
            </View>
            <Text style={styles.detailTag}>{meal.tags[0]}</Text>
            <View style={styles.reviewsBlock}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
              {meal.reviews?.length ? (
                meal.reviews.slice(0, 3).map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <Text style={styles.reviewTitle}>{review.rating}★ {review.title}</Text>
                    <Text style={styles.reviewMeta}>{review.reviewerName} · {review.status}</Text>
                    <Text style={styles.reviewBody}>{review.body}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyReviewText}>No reviews yet</Text>
              )}
              <View style={styles.reviewForm}>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable key={star} onPress={() => setRating(star)}>
                      <Ionicons
                        color={resolveThemeColor(star <= rating ? "#FFB020" : "#D8D3CE")}
                        name={star <= rating ? "star" : "star-outline"}
                        size={18}
                      />
                    </Pressable>
                  ))}
                </View>
                <TextInput
                  onChangeText={setReviewTitle}
                  placeholder="Review title"
                  placeholderTextColor={resolveThemeColor("#8B8580")}
                  style={styles.reviewInput}
                  value={reviewTitle}
                />
                <TextInput
                  multiline
                  onChangeText={setReviewBody}
                  placeholder="Share your experience"
                  placeholderTextColor={resolveThemeColor("#8B8580")}
                  style={[styles.reviewInput, styles.reviewTextArea]}
                  value={reviewBody}
                />
                {reviewError ? <Text style={styles.errorText}>{reviewError}</Text> : null}
                <Pressable
                  disabled={savingReview || !reviewTitle.trim() || !reviewBody.trim()}
                  onPress={() => void submitReview()}
                  style={[styles.reviewButton, (savingReview || !reviewTitle.trim() || !reviewBody.trim()) && styles.reviewButtonDisabled]}
                >
                  <Text style={styles.reviewButtonText}>{savingReview ? "Submitting..." : "Submit Review"}</Text>
                </Pressable>
              </View>
            </View>
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
              <Pressable
                disabled={isSubmitting}
                onPress={() => void onAdd()}
                style={[styles.addButton, isSubmitting && styles.reviewButtonDisabled]}
              >
                <Ionicons color={resolveThemeColor("#FFFFFF")} name="cart-outline" size={14} />
                <Text style={styles.addButtonText}>
                  {isSubmitting ? "Saving..." : selectionLabel ?? `Add to Cart — ${formatNaira(meal.price * quantity)}`}
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

const toTitleCase = (value: string) =>
  value.replace(/\b\w/g, (letter) => letter.toUpperCase());

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
    <Ionicons color={resolveThemeColor("#FF4A17")} name={icon} size={15} />
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
        <Ionicons color={resolveThemeColor("#FFFFFF")} name="cart-outline" size={18} />
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

const styles = createThemedStyleSheet({
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
  dayActionButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 10,
    flex: 1,
    height: 24,
    justifyContent: "center",
  },
  dayActionDisabled: {
    opacity: 0.45,
  },
  dayActions: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  dayActionText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  dayCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 92,
    padding: 10,
    width: 132,
    ...skeuo.card,
  },
  dayCardLocked: {
    backgroundColor: "#F2EFED",
  },
  dayLabel: {
    color: "#FF4A17",
    fontSize: 11,
    fontWeight: "900",
  },
  dayMeal: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 7,
  },
  daySkipButton: {
    alignItems: "center",
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    height: 24,
    justifyContent: "center",
    width: 42,
  },
  daySkipText: {
    color: "#C8320D",
    fontSize: 9,
    fontWeight: "900",
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
  emptyReviewText: {
    color: "#817B75",
    fontSize: 11,
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
  errorText: {
    color: "#C8320D",
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 6,
    width: "100%",
  },
  filterBlock: {
    marginTop: 10,
  },
  ratingSummary: {
    color: "#FFB020",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 7,
  },
  reviewBody: {
    color: "#817B75",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },
  reviewButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 9,
    height: 34,
    justifyContent: "center",
    marginTop: 8,
    ...skeuo.action,
  },
  reviewButtonDisabled: {
    opacity: 0.55,
  },
  reviewButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 9,
    ...skeuo.card,
  },
  reviewForm: {
    gap: 7,
    marginTop: 10,
  },
  reviewInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    color: "#171513",
    fontSize: 11,
    minHeight: 34,
    paddingHorizontal: 10,
    ...skeuo.pressed,
  },
  reviewMeta: {
    color: "#8B8580",
    fontSize: 9,
    marginTop: 3,
  },
  reviewsBlock: {
    gap: 8,
    marginTop: 14,
  },
  reviewsTitle: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  reviewTextArea: {
    minHeight: 64,
    paddingTop: 9,
    textAlignVertical: "top",
  },
  reviewTitle: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  weeklyHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  weeklyHint: {
    color: "#817B75",
    fontSize: 10,
    fontWeight: "700",
  },
  weeklyPlanner: {
    marginBottom: 12,
    marginTop: 5,
  },
  weeklyRow: {
    gap: 8,
    paddingRight: 18,
  },
  weeklyTitle: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
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
  starRow: {
    flexDirection: "row",
    gap: 5,
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
