import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import {
  ADMIN_PAGE_SIZE,
  type AdminMeal,
  type AdminMealStatus,
  useAdminStore,
} from "@/shared/state";
import { createThemedStyleSheet, resolveThemeColor, skeuo } from "@/shared/theme";
import type { MealTag } from "@/app/meals/types";
import { adminService } from "../services";
import {
  AdminActionButton,
  AdminCard,
  AdminPill,
  AdminScreen,
  AdminSectionTitle,
} from "./AdminShared";

type MealForm = {
  calories: string;
  carbs: string;
  category: string;
  description: string;
  detailDescription: string;
  fat: string;
  imageUrl: string;
  name: string;
  price: string;
  protein: string;
  status: AdminMealStatus;
  tags: string;
};

const mealStatuses: AdminMealStatus[] = ["Available", "Hidden", "Sold Out"];
const validTags: MealTag[] = ["vegetarian", "weight loss", "vegan", "high protein", "low carb"];
const validUploadMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;

const emptyForm: MealForm = {
  calories: "350",
  carbs: "30",
  category: "Breakfast",
  description: "",
  detailDescription: "",
  fat: "12",
  imageUrl: "",
  name: "",
  price: "2500",
  protein: "18",
  status: "Available",
  tags: "vegetarian",
};

const mealToForm = (meal: AdminMeal): MealForm => ({
  calories: String(meal.calories),
  carbs: String(meal.carbs),
  category: meal.category,
  description: meal.description,
  detailDescription: meal.detailDescription,
  fat: String(meal.fat),
  imageUrl: meal.imageUrl,
  name: meal.name,
  price: String(meal.price),
  protein: String(meal.protein),
  status: meal.status,
  tags: meal.tags.join(", "),
});

const parseTags = (value: string): MealTag[] => {
  const tags = value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag): tag is MealTag => validTags.includes(tag as MealTag));
  return tags.length ? tags : ["vegetarian"];
};

const toNumber = (value: string, fallback: number) => {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const AdminMealsScreen = () => {
  const meals = useAdminStore((state) => state.meals);
  const addMeal = useAdminStore((state) => state.addMeal);
  const updateMeal = useAdminStore((state) => state.updateMeal);
  const deleteMeal = useAdminStore((state) => state.deleteMeal);
  const loadMeals = useAdminStore((state) => state.loadMeals);
  const pagination = usePagination(meals, ADMIN_PAGE_SIZE);
  const [editingMealId, setEditingMealId] = useState<string>();
  const [form, setForm] = useState<MealForm>(emptyForm);
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = Boolean(editingMealId);
  const canSave = Boolean(form.name.trim() && form.description.trim() && form.imageUrl.trim());

  useEffect(() => {
    void loadMeals();
  }, [loadMeals]);

  const stats = useMemo(
    () => ({
      available: meals.filter((meal) => meal.status === "Available").length,
      hidden: meals.filter((meal) => meal.status === "Hidden").length,
      soldOut: meals.filter((meal) => meal.status === "Sold Out").length,
      total: meals.length,
    }),
    [meals],
  );

  const updateForm = (key: keyof MealForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setEditingMealId(undefined);
    setForm(emptyForm);
  };

  const startEdit = (meal: AdminMeal) => {
    setEditingMealId(meal.id);
    setForm(mealToForm(meal));
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to upload meal images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.72,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    const base64 = asset?.base64;
    if (!asset || !base64) {
      return;
    }

    const assetMimeType = asset.mimeType ?? "";
    const mimeType = validUploadMimeTypes.includes(assetMimeType as (typeof validUploadMimeTypes)[number])
      ? assetMimeType
      : "image/jpeg";
    setForm((current) => ({ ...current, imageUrl: asset.uri }));
    setIsUploading(true);
    try {
      const uploaded = await adminService.uploadMealImage({
        base64,
        fileName: asset.fileName ?? `meal-${Date.now()}.jpg`,
        mimeType,
      });
      setForm((current) => ({ ...current, imageUrl: uploaded.url }));
    } catch (error) {
      Alert.alert(
        "Upload failed",
        error instanceof Error ? error.message : "Unable to upload this meal image.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    const payload = {
      calories: toNumber(form.calories, 0),
      carbs: toNumber(form.carbs, 0),
      category: form.category.trim(),
      description: form.description.trim(),
      detailDescription: form.detailDescription.trim() || form.description.trim(),
      fat: toNumber(form.fat, 0),
      imageUrl: form.imageUrl.trim(),
      name: form.name.trim(),
      price: toNumber(form.price, 0),
      protein: toNumber(form.protein, 0),
      status: form.status,
      tags: parseTags(form.tags),
    };

    if (editingMealId) {
      await updateMeal(editingMealId, payload);
    } else {
      await addMeal(payload);
    }
    resetForm();
  };

  return (
    <AdminScreen>
      <AdminSectionTitle
        subtitle="Create, update, hide, sell out, and remove meals from the customer menu."
        title="Manage Meals"
      />
      <View style={styles.statsRow}>
        <AdminPill label={`${stats.total} total`} tone="blue" />
        <AdminPill label={`${stats.available} available`} tone="green" />
        <AdminPill label={`${stats.soldOut} sold out`} tone="yellow" />
        <AdminPill label={`${stats.hidden} hidden`} tone="gray" />
      </View>

      <AdminCard>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>{isEditing ? "Edit Meal" : "Add Meal"}</Text>
          {isEditing ? (
            <Pressable onPress={resetForm} style={styles.clearButton}>
              <Text style={styles.clearText}>Cancel Edit</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.previewWrap}>
          {form.imageUrl ? (
            <Image source={{ uri: form.imageUrl }} style={styles.previewImage} />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Ionicons color={resolveThemeColor("#C9C5C1")} name="image-outline" size={32} />
              <Text style={styles.previewText}>Meal image preview</Text>
            </View>
          )}
        </View>

        <Pressable disabled={isUploading} onPress={() => void handlePickImage()} style={styles.uploadButton}>
          <Ionicons color={resolveThemeColor("#FF4A17")} name="cloud-upload-outline" size={15} />
          <Text style={styles.uploadText}>{isUploading ? "Uploading image..." : "Upload Meal Image"}</Text>
        </Pressable>

        <MealInput label="Meal Name" onChangeText={(value) => updateForm("name", value)} value={form.name} />
        <MealInput label="Image URL" onChangeText={(value) => updateForm("imageUrl", value)} value={form.imageUrl} />
        <View style={styles.twoCol}>
          <MealInput label="Category" onChangeText={(value) => updateForm("category", value)} value={form.category} />
          <MealInput label="Price" onChangeText={(value) => updateForm("price", value)} value={form.price} />
        </View>
        <MealInput
          label="Short Description"
          onChangeText={(value) => updateForm("description", value)}
          value={form.description}
        />
        <MealInput
          label="Full Description"
          multiline
          onChangeText={(value) => updateForm("detailDescription", value)}
          value={form.detailDescription}
        />
        <MealInput label="Tags" onChangeText={(value) => updateForm("tags", value)} value={form.tags} />
        <View style={styles.twoCol}>
          <MealInput label="Calories" onChangeText={(value) => updateForm("calories", value)} value={form.calories} />
          <MealInput label="Protein" onChangeText={(value) => updateForm("protein", value)} value={form.protein} />
        </View>
        <View style={styles.twoCol}>
          <MealInput label="Carbs" onChangeText={(value) => updateForm("carbs", value)} value={form.carbs} />
          <MealInput label="Fat" onChangeText={(value) => updateForm("fat", value)} value={form.fat} />
        </View>
        <StatusPicker
          onChange={(status) => setForm((current) => ({ ...current, status }))}
          value={form.status}
        />
        <AdminActionButton disabled={!canSave || isUploading} onPress={() => void handleSave()}>
          {isEditing ? "Update Meal" : "Add Meal"}
        </AdminActionButton>
      </AdminCard>

      {pagination.pageItems.map((meal) => (
        <AdminCard key={meal.id}>
          <View style={styles.mealRow}>
            <Image source={{ uri: meal.imageUrl }} style={styles.mealThumb} />
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealMeta}>
                {meal.category} · ₦{meal.price.toLocaleString()} · {meal.protein}g protein
              </Text>
              <Text numberOfLines={2} style={styles.mealDescription}>{meal.description}</Text>
            </View>
            <AdminPill
              label={meal.status}
              tone={meal.status === "Available" ? "green" : meal.status === "Sold Out" ? "yellow" : "gray"}
            />
          </View>
          <View style={styles.statusRow}>
            {mealStatuses.map((status) => (
              <Pressable
                key={status}
                onPress={() => void updateMeal(meal.id, { status })}
                style={[styles.statusChip, meal.status === status && styles.statusChipActive]}
              >
                <Text style={[styles.statusText, meal.status === status && styles.statusTextActive]}>
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.actions}>
            <AdminActionButton onPress={() => startEdit(meal)}>Edit</AdminActionButton>
            <Pressable onPress={() => void deleteMeal(meal.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </AdminCard>
      ))}

      <PaginationControls
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        onNext={pagination.goNext}
        onPrevious={pagination.goPrevious}
        page={pagination.page}
        totalPages={pagination.totalPages}
      />
    </AdminScreen>
  );
};

const MealInput = ({
  label,
  multiline,
  onChangeText,
  value,
}: {
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  value: string;
}) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      multiline={multiline}
      onChangeText={onChangeText}
      placeholderTextColor={resolveThemeColor("#8B8580")}
      selectionColor={resolveThemeColor("#C8320D")}
      style={[styles.input, multiline && styles.textArea]}
      value={value}
    />
  </View>
);

const StatusPicker = ({
  onChange,
  value,
}: {
  onChange: (status: AdminMealStatus) => void;
  value: AdminMealStatus;
}) => (
  <View style={styles.statusRow}>
    {mealStatuses.map((status) => {
      const active = value === status;
      return (
        <Pressable
          key={status}
          onPress={() => onChange(status)}
          style={[styles.statusChip, active && styles.statusChipActive]}
        >
          <Text style={[styles.statusText, active && styles.statusTextActive]}>{status}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = createThemedStyleSheet({
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  clearButton: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  clearText: {
    color: "#C8320D",
    fontSize: 11,
    fontWeight: "900",
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderColor: "#FFB69E",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    height: 36,
    justifyContent: "center",
    ...skeuo.pressed,
  },
  deleteText: {
    color: "#C8320D",
    fontSize: 11,
    fontWeight: "900",
  },
  formHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  formTitle: {
    color: "#171513",
    fontSize: 15,
    fontWeight: "900",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    color: "#171513",
    elevation: 2,
    fontSize: 12,
    height: 37,
    paddingHorizontal: 10,
    ...skeuo.pressed,
  },
  inputLabel: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 7,
  },
  inputWrap: {
    flex: 1,
    marginBottom: 11,
  },
  mealDescription: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  mealInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  mealMeta: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 3,
  },
  mealName: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "900",
  },
  mealRow: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  mealThumb: {
    backgroundColor: "#F2EFED",
    borderRadius: 10,
    height: 62,
    width: 62,
  },
  previewImage: {
    height: 142,
    width: "100%",
  },
  previewPlaceholder: {
    alignItems: "center",
    backgroundColor: "#F2EFED",
    height: 142,
    justifyContent: "center",
  },
  previewText: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 7,
  },
  previewWrap: {
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderTopWidth: 1,
    elevation: 3,
    marginBottom: 13,
    overflow: "hidden",
    ...skeuo.card,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    height: 29,
    justifyContent: "center",
    paddingHorizontal: 12,
    ...skeuo.pressed,
  },
  statusChipActive: {
    backgroundColor: "#FFE8DF",
    borderColor: "#FF4A17",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
    marginTop: 6,
  },
  statusText: {
    color: "#706A65",
    fontSize: 10,
    fontWeight: "800",
  },
  statusTextActive: {
    color: "#FF4A17",
  },
  textArea: {
    height: 72,
    paddingTop: 9,
    textAlignVertical: "top",
  },
  twoCol: {
    flexDirection: "row",
    gap: 8,
  },
  uploadButton: {
    alignItems: "center",
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    flexDirection: "row",
    gap: 8,
    height: 38,
    justifyContent: "center",
    marginBottom: 12,
    ...skeuo.pressed,
  },
  uploadText: {
    color: "#FF4A17",
    fontSize: 11,
    fontWeight: "900",
  },
});
