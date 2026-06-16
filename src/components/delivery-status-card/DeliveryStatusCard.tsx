import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { skeuo } from "@/shared/theme";

export type DeliveryStatusCardProps = {
  eta?: string;
  onPress?: () => void;
  status?: string;
  title?: string;
  testID?: string;
};

export const DeliveryStatusCard = ({
  eta = "Today, 12:30 PM",
  onPress,
  status = "Scheduled",
  testID,
  title = "Meal delivery",
}: DeliveryStatusCardProps) => (
  <Pressable onPress={onPress} style={styles.card} testID={testID}>
    <View style={styles.iconWrap}>
      <Ionicons color="#FF4A17" name="car-outline" size={22} />
    </View>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.eta}>{eta}</Text>
    </View>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#E8F7FF",
    borderColor: "#BFE8FF",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#1479B8",
    fontSize: 10,
    fontWeight: "900",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 13,
    borderTopWidth: 1,
    elevation: 4,
    flexDirection: "row",
    minHeight: 70,
    padding: 12,
    ...skeuo.card,
  },
  content: {
    flex: 1,
    marginLeft: 11,
  },
  eta: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 3,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
    ...skeuo.pressed,
  },
  title: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
});

