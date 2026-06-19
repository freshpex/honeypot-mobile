import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "@/components";
import { formatNaira } from "@/shared/state";
import { createThemedStyleSheet, resolveThemeColor, skeuo } from "@/shared/theme";
import {
  personalizationService,
  type HealthGoal,
  type PersonalizationProfile,
} from "../services";

const defaultGoal: HealthGoal = {
  calorieTarget: 1800,
  macroCarbs: 40,
  macroFat: 25,
  macroProtein: 35,
  primaryGoal: "Weight Loss",
  proteinGoal: 120,
};

export const PersonalizationScreen = () => {
  const [profile, setProfile] = useState<PersonalizationProfile>();
  const [goal, setGoal] = useState(defaultGoal);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const response = await personalizationService.getProfile();
      setProfile(response);
      if (response.healthGoal) {
        setGoal(response.healthGoal);
      }
      setError(undefined);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load preferences.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const goals = useMemo(() => ["Weight Loss", "Muscle Gain", "Balanced", "Heart Health"], []);
  const recommendations = useMemo(() => profile?.recommendations ?? [], [profile?.recommendations]);

  const save = async () => {
    setSaving(true);
    try {
      const response = await personalizationService.updateHealthGoal(goal);
      setProfile(response);
      if (response.healthGoal) {
        setGoal(response.healthGoal);
      }
      setError(undefined);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalIcon}>
            <Ionicons color={resolveThemeColor("#FF4A17")} name="options-outline" size={22} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.title}>Meal Goals</Text>
            <Text style={styles.subtitle}>Personalize recommendations from the backend profile.</Text>
          </View>
        </View>

        <View style={styles.chipRow}>
          {goals.map((item) => {
            const active = goal.primaryGoal === item;
            return (
              <Pressable
                key={item}
                onPress={() => setGoal((current) => ({ ...current, primaryGoal: item }))}
                style={[styles.goalChip, active && styles.goalChipActive]}
              >
                <Text style={[styles.goalChipText, active && styles.goalChipTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.inputGrid}>
          <GoalInput
            label="Calories"
            onChange={(value) => setGoal((current) => ({ ...current, calorieTarget: value }))}
            value={goal.calorieTarget}
          />
          <GoalInput
            label="Protein g"
            onChange={(value) => setGoal((current) => ({ ...current, proteinGoal: value }))}
            value={goal.proteinGoal}
          />
          <GoalInput
            label="Protein %"
            onChange={(value) => setGoal((current) => ({ ...current, macroProtein: value }))}
            value={goal.macroProtein}
          />
          <GoalInput
            label="Carbs %"
            onChange={(value) => setGoal((current) => ({ ...current, macroCarbs: value }))}
            value={goal.macroCarbs}
          />
          <GoalInput
            label="Fat %"
            onChange={(value) => setGoal((current) => ({ ...current, macroFat: value }))}
            value={goal.macroFat}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable disabled={saving} onPress={() => void save()} style={[styles.saveButton, saving && styles.buttonDisabled]}>
          <Text style={styles.saveText}>{saving ? "Saving..." : "Save Personalization"}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <View style={styles.recommendationStack}>
        {recommendations.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
            <View style={styles.mealBody}>
              <View style={styles.mealHeader}>
                <View style={styles.flex}>
                  <Text numberOfLines={1} style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealMeta}>{meal.calories} cal • {meal.protein}g protein</Text>
                </View>
                <Text style={styles.price}>{formatNaira(meal.price)}</Text>
              </View>
              <View style={styles.reasonRow}>
                {meal.why.slice(0, 2).map((reason) => (
                  <Text key={reason} style={styles.reasonPill}>{reason}</Text>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
};

const GoalInput = ({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      keyboardType="number-pad"
      onChangeText={(text) => onChange(Number(text.replace(/\D/g, "")) || 0)}
      selectionColor={resolveThemeColor("#C8320D")}
      style={styles.input}
      value={String(value)}
    />
  </View>
);

const styles = createThemedStyleSheet({
  buttonDisabled: {
    opacity: 0.62,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  errorText: {
    color: "#C8320D",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 10,
  },
  flex: {
    flex: 1,
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 18,
    padding: 16,
    ...skeuo.deepCard,
  },
  goalChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...skeuo.pressed,
  },
  goalChipActive: {
    backgroundColor: "#FFE8DF",
    borderColor: "#FF4A17",
  },
  goalChipText: {
    color: "#706A65",
    fontSize: 11,
    fontWeight: "800",
  },
  goalChipTextActive: {
    color: "#FF4A17",
  },
  goalHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  goalIcon: {
    alignItems: "center",
    backgroundColor: "#FFF3EE",
    borderRadius: 18,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  input: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "900",
    height: 34,
    padding: 0,
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  inputLabel: {
    color: "#817B75",
    fontSize: 10,
    fontWeight: "800",
  },
  inputWrap: {
    backgroundColor: "#FAF9F8",
    borderColor: "#E8E2DD",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: "30%",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  mealBody: {
    flex: 1,
    padding: 10,
  },
  mealCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    overflow: "hidden",
    ...skeuo.card,
  },
  mealHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  mealImage: {
    height: 98,
    width: 96,
  },
  mealMeta: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 4,
  },
  mealName: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  price: {
    color: "#FF4A17",
    fontSize: 12,
    fontWeight: "900",
  },
  reasonPill: {
    backgroundColor: "#FFF3EE",
    borderRadius: 10,
    color: "#C8320D",
    fontSize: 9,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  reasonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  recommendationStack: {
    gap: 10,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    marginTop: 16,
    ...skeuo.action,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  subtitle: {
    color: "#817B75",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  title: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
});
