import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";

export type PlanCardProps = {
  isSelected?: boolean;
  meals?: string;
  name?: string;
  onPress?: () => void;
  price?: string;
  testID?: string;
};

export const PlanCard = ({
  isSelected,
  meals = "21 meals - 3/day",
  name = "Basic",
  onPress,
  price = "N25,000",
  testID,
}: PlanCardProps) => (
  <Pressable onPress={onPress} style={[styles.card, isSelected && styles.selected]} testID={testID}>
    <View style={styles.left}>
      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected ? <Ionicons color={resolveThemeColor("#FFFFFF")} name="checkmark" size={12} /> : null}
      </View>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meals}>{meals}</Text>
      </View>
    </View>
    <Text style={styles.price}>{price}</Text>
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
    paddingVertical: 10,
    ...skeuo.card,
  },
  left: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  meals: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 3,
  },
  name: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  price: {
    color: "#FF4A17",
    fontSize: 14,
    fontWeight: "900",
  },
  radio: {
    alignItems: "center",
    backgroundColor: "#F5F2EF",
    borderColor: "#E8E2DD",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    height: 18,
    justifyContent: "center",
    width: 18,
  },
  radioSelected: {
    backgroundColor: "#FF4A17",
    borderColor: "#FF4A17",
  },
  selected: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FF4A17",
  },
});

