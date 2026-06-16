import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import {
  DELIVERY_FEE,
  formatNaira,
  getCartItemCount,
  getCartSubtotal,
  useCustomerStore,
  useMealCartStore,
} from "@/shared/state";
import type { DeliveryAddress, SavedCard } from "@/shared/state";
import type { MealsStackParamList } from "../types";
import { CartBar } from "./MenuScreen";

type CheckoutScreenProps = NativeStackScreenProps<MealsStackParamList, "Checkout">;

export const CheckoutScreen = ({ navigation }: CheckoutScreenProps) => {
  const items = useMealCartStore((state) => state.items);
  const clearCart = useMealCartStore((state) => state.clearCart);
  const addresses = useCustomerStore((state) => state.addresses);
  const cards = useCustomerStore((state) => state.cards);
  const addOrder = useCustomerStore((state) => state.addOrder);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [cardSheetOpen, setCardSheetOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [selectedCardId, setSelectedCardId] = useState<string>();
  const itemCount = useMemo(() => getCartItemCount(items), [items]);
  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const total = subtotal + DELIVERY_FEE;
  const addressPagination = usePagination(addresses);
  const cardPagination = usePagination(cards);

  const effectiveAddressId = useMemo(
    () =>
      addresses.some((address) => address.id === selectedAddressId)
        ? selectedAddressId
        : addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id,
    [addresses, selectedAddressId],
  );
  const effectiveCardId = useMemo(
    () => (cards.some((card) => card.id === selectedCardId) ? selectedCardId : cards[0]?.id),
    [cards, selectedCardId],
  );
  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === effectiveAddressId),
    [addresses, effectiveAddressId],
  );
  const selectedCard = useMemo(
    () => cards.find((card) => card.id === effectiveCardId),
    [cards, effectiveCardId],
  );
  const canConfirm = Boolean(items.length && selectedAddress && selectedCard);

  const handleConfirmOrder = () => {
    if (!canConfirm || !selectedAddress || !selectedCard) {
      return;
    }
    addOrder({
      deliveryAddress: selectedAddress,
      items,
      paymentCardLast4: selectedCard.last4,
      paymentMethod: "Card",
      total,
      type: "One Off",
    });
    clearCart();
    navigation.getParent()?.navigate("Orders");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons color="#171513" name="arrow-back" size={17} />
          </Pressable>
          <Text style={styles.title}>Checkout</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionLabel icon="location-outline" title="Delivery Location" />
          {addressPagination.pageItems.map((address) => (
            <SelectableRow
              key={address.id}
              active={address.id === effectiveAddressId}
              icon="location-outline"
              onPress={() => setSelectedAddressId(address.id)}
              subtitle={`${address.address}, ${address.city}`}
              tint="#FFE8DF"
              title={address.label}
            />
          ))}
          <PaginationControls
            canGoNext={addressPagination.canGoNext}
            canGoPrevious={addressPagination.canGoPrevious}
            onNext={addressPagination.goNext}
            onPrevious={addressPagination.goPrevious}
            page={addressPagination.page}
            totalPages={addressPagination.totalPages}
          />
          <Pressable onPress={() => setAddressSheetOpen(true)} style={styles.addLocationRow}>
            <Text style={styles.plus}>＋</Text>
            <Text style={styles.addLocationText}>
              {addresses.length ? "Add another location" : "Add new location"}
            </Text>
          </Pressable>

          <SectionLabel icon="card-outline" title="Payment Method" />
          <SelectableRow
            active={false}
            disabled
            icon="wallet-outline"
            onPress={() => undefined}
            rightText="Soon"
            subtitle="Wallet payments are coming soon"
            tint="#FFF4D8"
            title="HoneyPot Wallet"
          />
          {cardPagination.pageItems.map((card) => (
            <SelectableRow
              key={card.id}
              active={card.id === effectiveCardId}
              icon="card-outline"
              onPress={() => setSelectedCardId(card.id)}
              subtitle={`${card.holderName} · Expires ${card.expiry}`}
              tint="#EBF7FF"
              title={`Debit / Credit Card •••• ${card.last4}`}
            />
          ))}
          <PaginationControls
            canGoNext={cardPagination.canGoNext}
            canGoPrevious={cardPagination.canGoPrevious}
            onNext={cardPagination.goNext}
            onPrevious={cardPagination.goPrevious}
            page={cardPagination.page}
            totalPages={cardPagination.totalPages}
          />
          <Pressable onPress={() => setCardSheetOpen(true)} style={styles.manageRow}>
            <Text style={styles.plus}>＋</Text>
            <Text style={styles.manageText}>
              {cards.length ? "Add new payment card" : "Add payment card"}
            </Text>
            <Ionicons color="#8B8580" name="chevron-forward" size={15} />
          </Pressable>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <SummaryRow label="Subtotal" value={formatNaira(subtotal)} />
            <SummaryRow label="Delivery Fee" value={formatNaira(DELIVERY_FEE)} />
            <View style={styles.summaryDivider} />
            <SummaryRow bold label="Total" value={formatNaira(total)} />
          </View>

          {!canConfirm ? (
            <Text style={styles.validationText}>
              Add a delivery location and select a saved card to place this order.
            </Text>
          ) : null}

          <Pressable
            disabled={!canConfirm}
            onPress={handleConfirmOrder}
            style={[styles.confirmButton, !canConfirm && styles.confirmButtonDisabled]}
          >
            <Text style={styles.confirmText}>Confirm Order — {formatNaira(total)}</Text>
          </Pressable>
        </ScrollView>

        {itemCount > 0 ? (
          <CartBar
            count={itemCount}
            label="View cart"
            onPress={() => navigation.navigate("Cart")}
            total={total}
          />
        ) : null}
      </View>

      <AddressSheet
        onClose={() => setAddressSheetOpen(false)}
        onSaved={(address) => setSelectedAddressId(address.id)}
        visible={addressSheetOpen}
      />
      <CardSheet
        onClose={() => setCardSheetOpen(false)}
        onSaved={(card) => setSelectedCardId(card.id)}
        visible={cardSheetOpen}
      />
    </SafeAreaView>
  );
};

const SectionLabel = ({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) => (
  <Text style={styles.sectionLabel}>
    <Ionicons color="#FF4A17" name={icon} size={13} /> {title}
  </Text>
);

const SelectableRow = ({
  active,
  disabled,
  icon,
  onPress,
  rightText,
  subtitle,
  tint,
  title,
}: {
  active: boolean;
  disabled?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  rightText?: string;
  subtitle: string;
  tint: string;
  title: string;
}) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={[styles.paymentOption, active && styles.paymentOptionActive, disabled && styles.disabledRow]}
  >
    <View style={[styles.paymentIcon, { backgroundColor: tint }]}>
      <Ionicons color={icon === "wallet-outline" ? "#FFB020" : "#34A8F4"} name={icon} size={18} />
    </View>
    <View style={styles.paymentTextWrap}>
      <Text style={styles.paymentTitle}>{title}</Text>
      <Text style={styles.paymentSubtitle}>{subtitle}</Text>
    </View>
    {rightText ? (
      <View style={styles.soonPill}>
        <Text style={styles.soonText}>{rightText}</Text>
      </View>
    ) : (
      <View style={[styles.radio, active && styles.radioActive]}>
        {active ? <View style={styles.radioDot} /> : null}
      </View>
    )}
  </Pressable>
);

const AddressSheet = ({
  onClose,
  onSaved,
  visible,
}: {
  onClose: () => void;
  onSaved: (address: DeliveryAddress) => void;
  visible: boolean;
}) => {
  const addAddress = useCustomerStore((state) => state.addAddress);
  const [label, setLabel] = useState("Home");
  const [phone, setPhone] = useState("09054531822");
  const [address, setAddress] = useState("12 Ikeja, Lagos");
  const [city, setCity] = useState("Ikeja");
  const [stateName, setStateName] = useState("Lagos");
  const canSave = Boolean(label.trim() && phone.trim() && address.trim() && city.trim() && stateName.trim());

  const save = () => {
    if (!canSave) {
      return;
    }
    const savedAddress = addAddress({
      address: address.trim(),
      city: city.trim(),
      isDefault: true,
      label: label.trim(),
      phone: phone.trim(),
      state: stateName.trim(),
    });
    onSaved(savedAddress);
    onClose();
  };

  return (
    <BottomSheet onClose={onClose} title="Delivery Location" visible={visible}>
      <View style={styles.twoCol}>
        <SheetInput label="Label" onChangeText={setLabel} value={label} />
        <SheetInput label="Phone" onChangeText={setPhone} value={phone} />
      </View>
      <SheetInput label="Address" onChangeText={setAddress} value={address} />
      <View style={styles.twoCol}>
        <SheetInput focused label="City" onChangeText={setCity} value={city} />
        <SheetInput label="State" onChangeText={setStateName} value={stateName} />
      </View>
      <View style={styles.formActions}>
        <Pressable onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          disabled={!canSave}
          onPress={save}
          style={[styles.sheetSaveButton, !canSave && styles.confirmButtonDisabled]}
        >
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

const CardSheet = ({
  onClose,
  onSaved,
  visible,
}: {
  onClose: () => void;
  onSaved: (card: SavedCard) => void;
  visible: boolean;
}) => {
  const addCard = useCustomerStore((state) => state.addCard);
  const [cardNumber, setCardNumber] = useState("1234 5678 9012 3456");
  const [holderName, setHolderName] = useState("ENOCH OLUWAKAYODE EPEKIPOLU");
  const [expiry, setExpiry] = useState("11/27");
  const [cvv, setCvv] = useState("");
  const canSave = Boolean(cardNumber.replace(/\s/g, "").length >= 12 && holderName.trim() && expiry.trim());

  const save = () => {
    if (!canSave) {
      return;
    }
    const savedCard = addCard({
      expiry: expiry.trim(),
      holderName: holderName.trim().toUpperCase(),
      number: cardNumber,
    });
    onSaved(savedCard);
    onClose();
  };

  return (
    <BottomSheet onClose={onClose} title="Add Payment Card" visible={visible}>
      <SheetInput
        focused
        label="Card Number"
        onChangeText={setCardNumber}
        value={cardNumber}
      />
      <SheetInput
        label="Cardholder Name"
        onChangeText={setHolderName}
        value={holderName}
      />
      <View style={styles.twoCol}>
        <SheetInput label="Expiry Date" onChangeText={setExpiry} value={expiry} />
        <SheetInput label="CVV" onChangeText={setCvv} secureTextEntry value={cvv} />
      </View>
      <View style={styles.formActions}>
        <Pressable onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          disabled={!canSave}
          onPress={save}
          style={[styles.sheetSaveButton, !canSave && styles.confirmButtonDisabled]}
        >
          <Text style={styles.saveText}>Save Card</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

const BottomSheet = ({
  children,
  onClose,
  title,
  visible,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  visible: boolean;
}) => (
  <Modal animationType="slide" transparent visible={visible}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.sheetOverlay}
    >
      <View style={styles.sheet}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons color="#837D77" name="close" size={14} />
        </Pressable>
        <Text style={styles.sheetTitle}>{title}</Text>
        {children}
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const SheetInput = ({
  focused,
  label,
  onChangeText,
  secureTextEntry,
  value,
}: {
  focused?: boolean;
  label: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  value: string;
}) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      selectionColor="#C8320D"
      style={[styles.sheetInput, focused && styles.sheetInputFocused]}
      value={value}
    />
  </View>
);

const SummaryRow = ({
  bold,
  label,
  value,
}: {
  bold?: boolean;
  label: string;
  value: string;
}) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && styles.summaryLabelBold]}>{label}</Text>
    <Text style={[styles.summaryValue, bold && styles.summaryValueBold]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  addLocationRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEAE6",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    height: 38,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 12,
  },
  addLocationText: {
    color: "#817B75",
    fontSize: 11,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    height: 34,
    justifyContent: "center",
  },
  cancelText: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "800",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    marginTop: 18,
  },
  confirmButtonDisabled: {
    opacity: 0.55,
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  content: {
    paddingBottom: 90,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  disabledRow: {
    opacity: 0.65,
  },
  formActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 11,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputLabel: {
    color: "#171513",
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 5,
  },
  inputWrap: {
    flex: 1,
    marginTop: 10,
  },
  manageRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    height: 37,
    marginBottom: 17,
    paddingHorizontal: 12,
  },
  manageText: {
    color: "#817B75",
    flex: 1,
    fontSize: 11,
  },
  paymentIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  paymentOption: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEAE6",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 55,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  paymentOptionActive: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FF4A17",
  },
  paymentSubtitle: {
    color: "#817B75",
    fontSize: 9,
    marginTop: 2,
  },
  paymentTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  paymentTitle: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  plus: {
    color: "#817B75",
    fontSize: 14,
  },
  radio: {
    alignItems: "center",
    borderColor: "#D6D0CB",
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: "center",
    width: 16,
  },
  radioActive: {
    borderColor: "#FF4A17",
  },
  radioDot: {
    backgroundColor: "#FF4A17",
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  screen: {
    flex: 1,
  },
  sectionLabel: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
  },
  sheet: {
    backgroundColor: "#FAF9F8",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 12,
    paddingHorizontal: 14,
    paddingTop: 28,
  },
  sheetInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
    color: "#171513",
    fontSize: 11,
    height: 30,
    paddingHorizontal: 9,
  },
  sheetInputFocused: {
    borderColor: "#FF4A17",
    borderWidth: 1,
  },
  sheetOverlay: {
    backgroundColor: "rgba(0,0,0,0.76)",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetSaveButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 8,
    flex: 1,
    height: 34,
    justifyContent: "center",
  },
  sheetTitle: {
    color: "#171513",
    fontSize: 15,
    fontWeight: "900",
  },
  soonPill: {
    backgroundColor: "#F8F6F4",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  soonText: {
    color: "#8B8580",
    fontSize: 9,
    fontWeight: "900",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  summaryDivider: {
    backgroundColor: "#EEEAE6",
    height: StyleSheet.hairlineWidth,
    marginVertical: 9,
  },
  summaryLabel: {
    color: "#9A948F",
    fontSize: 11,
  },
  summaryLabelBold: {
    color: "#171513",
    fontWeight: "900",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryTitle: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 9,
  },
  summaryValue: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "700",
  },
  summaryValueBold: {
    color: "#FF4A17",
    fontWeight: "900",
  },
  title: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
  twoCol: {
    flexDirection: "row",
    gap: 8,
  },
  validationText: {
    color: "#C8320D",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 11,
  },
});
