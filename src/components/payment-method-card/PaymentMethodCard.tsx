import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";

export type PaymentMethodCardProps = {
  brand?: string;
  isSelected?: boolean;
  label?: string;
  onPress?: () => void;
  subtitle?: string;
  testID?: string;
};

export const PaymentMethodCard = ({
  brand = "card-outline",
  isSelected,
  label = "Debit / Credit Card",
  onPress,
  subtitle = "Pay securely with your card",
  testID,
}: PaymentMethodCardProps) => (
  <Pressable
    onPress={onPress}
    style={[styles.card, isSelected && styles.selected]}
    testID={testID}
  >
    <View style={styles.left}>
      <View style={styles.iconWrap}>
        <Ionicons color={resolveThemeColor("#1A9BE8")} name={brand as keyof typeof Ionicons.glyphMap} size={18} />
      </View>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
    <View style={[styles.radio, isSelected && styles.radioSelected]}>
      {isSelected ? <View style={styles.dot} /> : null}
    </View>
  </Pressable>
);

const styles = createThemedStyleSheet({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEE7E2",
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 62,
    paddingHorizontal: 12,
    ...skeuo.card,
  },
  dot: {
    backgroundColor: "#FF4A17",
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#E8F7FF",
    borderRadius: 9,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  label: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
  },
  left: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  radio: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    height: 18,
    justifyContent: "center",
    width: 18,
  },
  radioSelected: {
    borderColor: "#FF4A17",
  },
  selected: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FF4A17",
  },
  subtitle: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 3,
  },
});

