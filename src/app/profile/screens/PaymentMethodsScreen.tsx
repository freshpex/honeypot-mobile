import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { useCustomerStore } from "@/shared/state";
import type { ProfileStackParamList } from "../types";

type PaymentMethodsScreenProps = NativeStackScreenProps<ProfileStackParamList, "PaymentMethods">;

export const PaymentMethodsScreen = ({ navigation }: PaymentMethodsScreenProps) => {
  const cards = useCustomerStore((state) => state.cards);
  const addCard = useCustomerStore((state) => state.addCard);
  const removeCard = useCustomerStore((state) => state.removeCard);
  const [isAdding, setIsAdding] = useState(false);
  const [cardNumber, setCardNumber] = useState("1234 5678 9012 3456");
  const [holderName, setHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const cardPagination = usePagination(cards);

  const showForm = isAdding || !cards.length;
  const canSave = useMemo(
    () => cardNumber.replace(/\s/g, "").length >= 12 && holderName.trim() && expiry.trim(),
    [cardNumber, expiry, holderName],
  );

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    addCard({ expiry, holderName: holderName.trim().toUpperCase(), number: cardNumber });
    setIsAdding(false);
    setCardNumber("");
    setHolderName("");
    setExpiry("");
    setCvv("");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons color="#171513" name="arrow-back" size={17} />
          </Pressable>
          <Text style={styles.title}>Payment Methods</Text>
        </View>

        <Pressable onPress={() => navigation.navigate("MyWallet")} style={styles.walletCard}>
          <View style={styles.walletIcon}>
            <Ionicons color="#FFFFFF" name="wallet-outline" size={20} />
          </View>
          <View style={styles.walletTextWrap}>
            <Text style={styles.walletTitle}>HoneyPot Wallet</Text>
            <Text style={styles.walletSubtitle}>Fund & pay with your wallet</Text>
          </View>
          <Ionicons color="#FFFFFF" name="chevron-forward" size={18} />
        </Pressable>

        <Text style={styles.sectionTitle}>Saved Cards</Text>

        {showForm ? (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={styles.formHeaderLeft}>
                <Ionicons color="#706A65" name="lock-closed-outline" size={15} />
                <Text style={styles.formTitle}>Add New Card</Text>
              </View>
              <View style={styles.securePill}>
                <Text style={styles.secureText}>Secure</Text>
              </View>
            </View>
            <PaymentInput
              focused
              label="Card Number"
              onChangeText={setCardNumber}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
            />
            <PaymentInput
              label="Cardholder Name"
              onChangeText={setHolderName}
              placeholder="As on card"
              value={holderName}
            />
            <View style={styles.twoCol}>
              <PaymentInput
                label="Expiry Date"
                onChangeText={setExpiry}
                placeholder="MM/YY"
                value={expiry}
              />
              <PaymentInput
                label="CVV"
                onChangeText={setCvv}
                placeholder="***"
                secureTextEntry
                value={cvv}
              />
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => setIsAdding(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              >
                <Text style={styles.saveText}>Save Card</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.cardList}>
              {cardPagination.pageItems.map((card) => (
                <View key={card.id} style={styles.savedCard}>
                  <View style={styles.mastercardBadge}>
                    <Text style={styles.mastercardText}>Mastercard</Text>
                  </View>
                  <View style={styles.savedCardTextWrap}>
                    <Text style={styles.savedCardNumber}>•••• •••• •••• {card.last4}</Text>
                    <Text style={styles.savedCardMeta}>
                      {card.holderName} · Expires {card.expiry}
                    </Text>
                  </View>
                  <Pressable onPress={() => removeCard(card.id)} hitSlop={10}>
                    <Ionicons color="#8B8580" name="trash-outline" size={16} />
                  </Pressable>
                </View>
              ))}
              <PaginationControls
                canGoNext={cardPagination.canGoNext}
                canGoPrevious={cardPagination.canGoPrevious}
                onNext={cardPagination.goNext}
                onPrevious={cardPagination.goPrevious}
                page={cardPagination.page}
                totalPages={cardPagination.totalPages}
              />
            </View>
            <Pressable onPress={() => setIsAdding(true)} style={styles.addCardButton}>
              <Text style={styles.addCardText}>＋ Add new card</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const PaymentInput = ({
  focused,
  label,
  onChangeText,
  placeholder,
  secureTextEntry,
  value,
}: {
  focused?: boolean;
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
}) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#8B8580"
      secureTextEntry={secureTextEntry}
      selectionColor="#C8320D"
      style={[styles.input, focused && styles.inputFocused]}
      value={value}
    />
  </View>
);

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  addCardButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E4DFDA",
    borderRadius: 10,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 39,
    justifyContent: "center",
    marginTop: 12,
  },
  addCardText: {
    color: "#706A65",
    fontSize: 13,
    fontWeight: "600",
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
    height: 36,
    justifyContent: "center",
  },
  cancelText: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "800",
  },
  cardList: {
    gap: 8,
  },
  content: {
    paddingBottom: 100,
    paddingHorizontal: 12,
    paddingTop: 18,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 13,
  },
  formHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  formHeaderLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  formTitle: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    color: "#171513",
    fontSize: 13,
    height: 37,
    paddingHorizontal: 10,
  },
  inputFocused: {
    borderColor: "#FF4A17",
    borderWidth: 1,
  },
  inputLabel: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },
  inputWrap: {
    flex: 1,
    marginBottom: 12,
  },
  mastercardBadge: {
    alignItems: "center",
    backgroundColor: "#16274A",
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  mastercardText: {
    color: "#FFFFFF",
    fontSize: 6,
    fontWeight: "900",
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  savedCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 54,
    paddingHorizontal: 11,
  },
  savedCardMeta: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 3,
  },
  savedCardNumber: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  savedCardTextWrap: {
    flex: 1,
    marginLeft: 11,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#FFA083",
    borderRadius: 8,
    flex: 1,
    height: 36,
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.8,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 20,
  },
  securePill: {
    backgroundColor: "#F8F6F4",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  secureText: {
    color: "#8B8580",
    fontSize: 9,
    fontWeight: "700",
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
  walletCard: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 11,
    flexDirection: "row",
    height: 61,
    marginTop: 17,
    overflow: "hidden",
    paddingHorizontal: 13,
  },
  walletIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  walletSubtitle: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  walletTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  walletTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
