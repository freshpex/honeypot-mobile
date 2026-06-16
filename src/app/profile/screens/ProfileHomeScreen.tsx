import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
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
import { useAuthStore, useCustomerStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import type { ProfileStackParamList } from "../types";

type ProfileHomeScreenProps = NativeStackScreenProps<ProfileStackParamList, "ProfileHome">;

export const ProfileHomeScreen = ({ navigation }: ProfileHomeScreenProps) => {
  const logout = useAuthStore((state) => state.logout);
  const [addressSheet, setAddressSheet] = useState<"list" | "form" | undefined>();
  const [dietSheetOpen, setDietSheetOpen] = useState(false);
  const rows = useMemo(
    () => [
      {
        icon: "location-outline",
        title: "Delivery Addresses",
        subtitle: "Manage your addresses",
        color: "#16A3FF",
        tint: "#EAF7FF",
        onPress: () => setAddressSheet("list"),
      },
      {
        icon: "heart-outline",
        title: "Dietary Preferences",
        subtitle: "Allergies & food preferences",
        color: "#2CC979",
        tint: "#EAFBF2",
        onPress: () => setDietSheetOpen(true),
      },
      {
        icon: "wallet-outline",
        title: "My Wallet",
        color: "#FFB020",
        tint: "#FFF4D8",
        onPress: () => navigation.navigate("MyWallet"),
      },
      {
        icon: "card-outline",
        title: "Payment Methods",
        color: "#34A8F4",
        tint: "#EBF7FF",
        onPress: () => navigation.navigate("PaymentMethods"),
      },
      {
        icon: "receipt-outline",
        title: "Payment History",
        color: "#8F8A85",
        tint: "#F1EFED",
        onPress: () => navigation.navigate("PaymentHistory"),
      },
      {
        icon: "share-social-outline",
        title: "Referral Program",
        color: "#8F8A85",
        tint: "#F1EFED",
        onPress: () => navigation.navigate("ReferralProgram"),
      },
      {
        icon: "help-circle-outline",
        title: "Support Center",
        color: "#8F8A85",
        tint: "#F1EFED",
        onPress: () => navigation.navigate("Support"),
      },
    ] satisfies {
      color: string;
      icon: keyof typeof Ionicons.glyphMap;
      onPress: () => void;
      subtitle?: string;
      tint: string;
      title: string;
    }[],
    [navigation],
  );

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>E</Text>
          </View>
          <View>
            <Text style={styles.name}>Enoch</Text>
            <Text style={styles.email}>enoch.megatransact@gmail.com</Text>
          </View>
        </View>

        <View style={styles.rows}>
          {rows.map((row) => (
            <Pressable key={row.title} onPress={row.onPress} style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: resolveThemeColor(row.tint) }]}>
                <Ionicons color={resolveThemeColor(row.color)} name={row.icon} size={18} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                {row.subtitle ? <Text style={styles.rowSubtitle}>{row.subtitle}</Text> : null}
              </View>
              <Ionicons color={resolveThemeColor("#837D77")} name="chevron-forward" size={17} />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={logout} style={styles.logout}>
          <Ionicons color={resolveThemeColor("#FF4A17")} name="log-out-outline" size={15} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
      <AddressSheet
        mode={addressSheet}
        onClose={() => setAddressSheet(undefined)}
        onCreate={() => setAddressSheet("form")}
      />
      <DietarySheet onClose={() => setDietSheetOpen(false)} visible={dietSheetOpen} />
    </SafeAreaView>
  );
};

const AddressSheet = ({
  mode,
  onClose,
  onCreate,
}: {
  mode?: "list" | "form";
  onClose: () => void;
  onCreate: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const addresses = useCustomerStore((state) => state.addresses);
  const addAddress = useCustomerStore((state) => state.addAddress);
  const removeAddress = useCustomerStore((state) => state.removeAddress);
  const addressPagination = usePagination(addresses);
  const [label, setLabel] = useState("Home");
  const [phone, setPhone] = useState("09054531822");
  const [address, setAddress] = useState("12 Ikeja, Lagos");
  const [city, setCity] = useState("Ikeja");
  const [stateName, setStateName] = useState("Lagos");

  const save = () => {
    addAddress({ address, city, isDefault: true, label, phone, state: stateName });
    onClose();
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={Boolean(mode)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetOverlay}
      >
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons color={resolveThemeColor("#FF4A17")} name="close" size={14} />
          </Pressable>
          <Text style={styles.sheetTitle}>Delivery Addresses</Text>
          {mode === "form" ? (
            <>
              <View style={styles.twoCol}>
                <LabeledInput label="Label" onChangeText={setLabel} value={label} />
                <LabeledInput label="Phone" onChangeText={setPhone} value={phone} />
              </View>
              <LabeledInput label="Address" onChangeText={setAddress} value={address} />
              <View style={styles.twoCol}>
                <LabeledInput focused label="City" onChangeText={setCity} value={city} />
                <LabeledInput label="State" onChangeText={setStateName} value={stateName} />
              </View>
              <View style={styles.formActions}>
                <Pressable onPress={onClose} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={save} style={styles.saveButton}>
                  <Text style={styles.saveText}>Save</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {addresses.length ? (
                <View style={styles.addressList}>
                  {addressPagination.pageItems.map((item) => (
                    <View key={item.id} style={styles.addressCard}>
                      <View style={styles.addressLeft}>
                        <Ionicons color={resolveThemeColor("#FF4A17")} name="location-outline" size={17} />
                        <View>
                          <Text style={styles.addressTitle}>{item.label} ★</Text>
                          <Text style={styles.addressText}>{item.address}</Text>
                          <Text style={styles.addressText}>{item.city}, {item.state}</Text>
                        </View>
                      </View>
                      <Pressable onPress={() => removeAddress(item.id)}>
                        <Ionicons color={resolveThemeColor("#8B8580")} name="trash-outline" size={15} />
                      </Pressable>
                    </View>
                  ))}
                  <PaginationControls
                    canGoNext={addressPagination.canGoNext}
                    canGoPrevious={addressPagination.canGoPrevious}
                    onNext={addressPagination.goNext}
                    onPrevious={addressPagination.goPrevious}
                    page={addressPagination.page}
                    totalPages={addressPagination.totalPages}
                  />
                </View>
              ) : (
                <View style={styles.emptyAddress}>
                  <Ionicons color={resolveThemeColor("#D1CDC9")} name="location-outline" size={31} />
                  <Text style={styles.emptySheetText}>No addresses saved yet</Text>
                </View>
              )}
              <Pressable onPress={onCreate} style={styles.addSheetButton}>
                <Text style={styles.addSheetButtonText}>＋ Add New Address</Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const DietarySheet = ({ onClose, visible }: { onClose: () => void; visible: boolean }) => {
  const insets = useSafeAreaInsets();
  const savedPreferences = useCustomerStore((state) => state.dietaryPreferences);
  const savedAllergies = useCustomerStore((state) => state.allergies);
  const saveDietaryPreferences = useCustomerStore((state) => state.saveDietaryPreferences);
  const [selected, setSelected] = useState(savedPreferences);
  const [allergies, setAllergies] = useState(savedAllergies);
  const chips = useMemo(
    () => ["Weight Loss", "High Protein", "Vegetarian", "Vegan", "Keto", "Low Carb"],
    [],
  );

  const toggle = (chip: string) => {
    setSelected((current) =>
      current.includes(chip) ? current.filter((item) => item !== chip) : [...current, chip],
    );
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetOverlay}
      >
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons color={resolveThemeColor("#837D77")} name="close" size={14} />
          </Pressable>
          <Text style={styles.sheetTitle}>Dietary Preferences</Text>
          <Text style={styles.sheetSubtitle}>Help us personalize your meal suggestions</Text>
          <Text style={styles.fieldLabel}>Diet Type</Text>
          <View style={styles.preferenceChips}>
            {chips.map((chip) => {
              const active = selected.includes(chip);
              return (
                <Pressable key={chip} onPress={() => toggle(chip)} style={[styles.preferenceChip, active && styles.preferenceChipActive]}>
                  <Text style={[styles.preferenceChipText, active && styles.preferenceChipTextActive]}>{chip}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.fieldLabel}>Allergies</Text>
          <TextInput
            multiline
            onChangeText={setAllergies}
            placeholder="List any food allergies (e.g. nuts, dairy, shellfish...)"
            placeholderTextColor={resolveThemeColor("#817B75")}
            style={styles.allergyInput}
            value={allergies}
          />
          <Pressable
            onPress={() => {
              saveDietaryPreferences(selected, allergies);
              onClose();
            }}
            style={styles.fullSaveButton}
          >
            <Text style={styles.saveText}>Save Preferences</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const LabeledInput = ({
  focused,
  label,
  onChangeText,
  value,
}: {
  focused?: boolean;
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      onChangeText={onChangeText}
      selectionColor={resolveThemeColor("#C8320D")}
      style={[styles.sheetInput, focused && styles.sheetInputFocused]}
      value={value}
    />
  </View>
);

const styles = createThemedStyleSheet({
  addSheetButton: {
    alignItems: "center",
    borderColor: "#E8E2DD",
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    height: 31,
    justifyContent: "center",
    marginTop: 12,
    ...skeuo.pressed,
  },
  addSheetButtonText: { color: "#171513", fontSize: 11, fontWeight: "700" },
  addressCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 57,
    paddingHorizontal: 13,
    ...skeuo.card,
  },
  addressLeft: { alignItems: "center", flexDirection: "row", gap: 10 },
  addressList: { marginTop: 18 },
  addressText: { color: "#817B75", fontSize: 9, marginTop: 2 },
  addressTitle: { color: "#171513", fontSize: 11, fontWeight: "900" },
  allergyInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    color: "#171513",
    fontSize: 11,
    height: 76,
    padding: 10,
    textAlignVertical: "top",
    ...skeuo.pressed,
  },
  avatar: { alignItems: "center", backgroundColor: "#FFE8DF", borderColor: "#FFFFFF", borderRadius: 20, borderTopWidth: 1, elevation: 3, height: 40, justifyContent: "center", width: 40, ...skeuo.pressed },
  avatarText: { color: "#FF4A17", fontSize: 16, fontWeight: "800" },
  cancelButton: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E8E2DD", borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, elevation: 2, flex: 1, height: 31, justifyContent: "center", ...skeuo.pressed },
  cancelText: { color: "#171513", fontSize: 11, fontWeight: "700" },
  closeButton: { position: "absolute", right: 10, top: 10 },
  content: { paddingBottom: 30, paddingHorizontal: 8, paddingTop: 17 },
  email: { color: "#817B75", fontSize: 12, marginTop: 3 },
  emptyAddress: { alignItems: "center", height: 90, justifyContent: "center" },
  emptySheetText: { color: "#8B8580", fontSize: 10, marginTop: 6 },
  fieldLabel: { color: "#171513", fontSize: 11, fontWeight: "800", marginBottom: 9, marginTop: 15 },
  formActions: { flexDirection: "row", gap: 8, marginTop: 11 },
  fullSaveButton: { alignItems: "center", backgroundColor: "#FF4A17", borderColor: "#FF8B68", borderRadius: 8, borderTopWidth: 1, elevation: 6, height: 36, justifyContent: "center", marginTop: 15, ...skeuo.action },
  inputLabel: { color: "#171513", fontSize: 9, fontWeight: "700", marginBottom: 5 },
  inputWrap: { flex: 1, marginTop: 10 },
  logout: { alignItems: "center", flexDirection: "row", gap: 5, justifyContent: "center", marginTop: 22 },
  logoutText: { color: "#FF4A17", fontSize: 13, fontWeight: "500" },
  name: { color: "#171513", fontSize: 17, fontWeight: "800" },
  preferenceChip: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E8E2DD", borderRadius: 15, borderWidth: StyleSheet.hairlineWidth, elevation: 2, height: 28, justifyContent: "center", paddingHorizontal: 14, ...skeuo.pressed },
  preferenceChipActive: { backgroundColor: "#FFE8DF", borderColor: "#FF4A17" },
  preferenceChipText: { color: "#706A65", fontSize: 10, fontWeight: "700" },
  preferenceChipTextActive: { color: "#FF4A17" },
  preferenceChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  profileHeader: { alignItems: "center", flexDirection: "row", gap: 13, marginBottom: 18 },
  row: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#FFFFFF", borderRadius: 10, borderTopWidth: 1, elevation: 4, flexDirection: "row", minHeight: 52, paddingHorizontal: 12, ...skeuo.card },
  rowIcon: { alignItems: "center", borderColor: "#FFFFFF", borderRadius: 8, borderTopWidth: 1, elevation: 2, height: 30, justifyContent: "center", marginRight: 12, width: 30, ...skeuo.pressed },
  rowSubtitle: { color: "#817B75", fontSize: 10, marginTop: 2 },
  rowTextWrap: { flex: 1 },
  rowTitle: { color: "#171513", fontSize: 12, fontWeight: "800" },
  rows: { gap: 7 },
  safeArea: { backgroundColor: "#FAF9F8", flex: 1 },
  saveButton: { alignItems: "center", backgroundColor: "#FF4A17", borderColor: "#FF8B68", borderRadius: 8, borderTopWidth: 1, elevation: 6, flex: 1, height: 31, justifyContent: "center", ...skeuo.action },
  saveText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  sheet: { backgroundColor: "#FAF9F8", borderTopLeftRadius: 10, borderTopRightRadius: 10, elevation: 14, paddingBottom: 12, paddingHorizontal: 14, paddingTop: 28, ...skeuo.floating },
  sheetInput: { backgroundColor: "#FFFFFF", borderColor: "#E8E2DD", borderRadius: 7, borderWidth: StyleSheet.hairlineWidth, color: "#171513", elevation: 2, fontSize: 11, height: 30, paddingHorizontal: 9, ...skeuo.pressed },
  sheetInputFocused: { borderColor: "#FF4A17", borderWidth: 1 },
  sheetOverlay: { backgroundColor: "rgba(0,0,0,0.76)", flex: 1, justifyContent: "flex-end" },
  sheetSubtitle: { color: "#817B75", fontSize: 10, marginTop: 5 },
  sheetTitle: { color: "#171513", fontSize: 15, fontWeight: "900" },
  twoCol: { flexDirection: "row", gap: 8 },
});
