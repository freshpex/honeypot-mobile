import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomerStore } from "@/shared/state";
import type { ProfileStackParamList } from "../types";

type ProfileHomeScreenProps = NativeStackScreenProps<ProfileStackParamList, "ProfileHome">;

export const ProfileHomeScreen = ({ navigation }: ProfileHomeScreenProps) => {
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
        onPress: () => undefined,
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
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
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
              <View style={[styles.rowIcon, { backgroundColor: row.tint }]}>
                <Ionicons color={row.color} name={row.icon} size={18} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                {row.subtitle ? <Text style={styles.rowSubtitle}>{row.subtitle}</Text> : null}
              </View>
              <Ionicons color="#837D77" name="chevron-forward" size={17} />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => navigation.getParent()?.getParent()?.navigate("Auth")} style={styles.logout}>
          <Ionicons color="#FF4A17" name="log-out-outline" size={15} />
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
  const addresses = useCustomerStore((state) => state.addresses);
  const addAddress = useCustomerStore((state) => state.addAddress);
  const removeAddress = useCustomerStore((state) => state.removeAddress);
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
    <Modal animationType="slide" transparent visible={Boolean(mode)}>
      <View style={styles.sheetOverlay}>
        <View style={styles.sheet}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons color="#FF4A17" name="close" size={14} />
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
                  {addresses.map((item) => (
                    <View key={item.id} style={styles.addressCard}>
                      <View style={styles.addressLeft}>
                        <Ionicons color="#FF4A17" name="location-outline" size={17} />
                        <View>
                          <Text style={styles.addressTitle}>{item.label} ★</Text>
                          <Text style={styles.addressText}>{item.address}</Text>
                          <Text style={styles.addressText}>{item.city}, {item.state}</Text>
                        </View>
                      </View>
                      <Pressable onPress={() => removeAddress(item.id)}>
                        <Ionicons color="#8B8580" name="trash-outline" size={15} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyAddress}>
                  <Ionicons color="#D1CDC9" name="location-outline" size={31} />
                  <Text style={styles.emptySheetText}>No addresses saved yet</Text>
                </View>
              )}
              <Pressable onPress={onCreate} style={styles.addSheetButton}>
                <Text style={styles.addSheetButtonText}>＋ Add New Address</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const DietarySheet = ({ onClose, visible }: { onClose: () => void; visible: boolean }) => {
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
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.sheetOverlay}>
        <View style={styles.sheet}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons color="#837D77" name="close" size={14} />
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
            placeholderTextColor="#817B75"
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
      </View>
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
      selectionColor="#C8320D"
      style={[styles.sheetInput, focused && styles.sheetInputFocused]}
      value={value}
    />
  </View>
);

const styles = StyleSheet.create({
  addSheetButton: {
    alignItems: "center",
    borderColor: "#E8E2DD",
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
    height: 31,
    justifyContent: "center",
    marginTop: 12,
  },
  addSheetButtonText: { color: "#171513", fontSize: 11, fontWeight: "700" },
  addressCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 57,
    paddingHorizontal: 13,
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
    color: "#171513",
    fontSize: 11,
    height: 76,
    padding: 10,
    textAlignVertical: "top",
  },
  avatar: { alignItems: "center", backgroundColor: "#FFE8DF", borderRadius: 20, height: 40, justifyContent: "center", width: 40 },
  avatarText: { color: "#FF4A17", fontSize: 16, fontWeight: "800" },
  cancelButton: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E8E2DD", borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, flex: 1, height: 31, justifyContent: "center" },
  cancelText: { color: "#171513", fontSize: 11, fontWeight: "700" },
  closeButton: { position: "absolute", right: 10, top: 10 },
  content: { paddingBottom: 30, paddingHorizontal: 8, paddingTop: 17 },
  email: { color: "#817B75", fontSize: 12, marginTop: 3 },
  emptyAddress: { alignItems: "center", height: 90, justifyContent: "center" },
  emptySheetText: { color: "#8B8580", fontSize: 10, marginTop: 6 },
  fieldLabel: { color: "#171513", fontSize: 11, fontWeight: "800", marginBottom: 9, marginTop: 15 },
  formActions: { flexDirection: "row", gap: 8, marginTop: 11 },
  fullSaveButton: { alignItems: "center", backgroundColor: "#FF4A17", borderRadius: 8, height: 36, justifyContent: "center", marginTop: 15 },
  inputLabel: { color: "#171513", fontSize: 9, fontWeight: "700", marginBottom: 5 },
  inputWrap: { flex: 1, marginTop: 10 },
  logout: { alignItems: "center", flexDirection: "row", gap: 5, justifyContent: "center", marginTop: 22 },
  logoutText: { color: "#FF4A17", fontSize: 13, fontWeight: "500" },
  name: { color: "#171513", fontSize: 17, fontWeight: "800" },
  preferenceChip: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E8E2DD", borderRadius: 15, borderWidth: StyleSheet.hairlineWidth, height: 28, justifyContent: "center", paddingHorizontal: 14 },
  preferenceChipActive: { backgroundColor: "#FFE8DF", borderColor: "#FF4A17" },
  preferenceChipText: { color: "#706A65", fontSize: 10, fontWeight: "700" },
  preferenceChipTextActive: { color: "#FF4A17" },
  preferenceChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  profileHeader: { alignItems: "center", flexDirection: "row", gap: 13, marginBottom: 18 },
  row: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E8E2DD", borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, flexDirection: "row", minHeight: 52, paddingHorizontal: 12 },
  rowIcon: { alignItems: "center", borderRadius: 8, height: 30, justifyContent: "center", marginRight: 12, width: 30 },
  rowSubtitle: { color: "#817B75", fontSize: 10, marginTop: 2 },
  rowTextWrap: { flex: 1 },
  rowTitle: { color: "#171513", fontSize: 12, fontWeight: "800" },
  rows: { gap: 7 },
  safeArea: { backgroundColor: "#FAF9F8", flex: 1 },
  saveButton: { alignItems: "center", backgroundColor: "#FF4A17", borderRadius: 8, flex: 1, height: 31, justifyContent: "center" },
  saveText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  sheet: { backgroundColor: "#FAF9F8", borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingBottom: 12, paddingHorizontal: 14, paddingTop: 28 },
  sheetInput: { backgroundColor: "#FFFFFF", borderColor: "#E8E2DD", borderRadius: 7, borderWidth: StyleSheet.hairlineWidth, color: "#171513", fontSize: 11, height: 30, paddingHorizontal: 9 },
  sheetInputFocused: { borderColor: "#FF4A17", borderWidth: 1 },
  sheetOverlay: { backgroundColor: "rgba(0,0,0,0.76)", flex: 1, justifyContent: "flex-end" },
  sheetSubtitle: { color: "#817B75", fontSize: 10, marginTop: 5 },
  sheetTitle: { color: "#171513", fontSize: 15, fontWeight: "900" },
  twoCol: { flexDirection: "row", gap: 8 },
});
