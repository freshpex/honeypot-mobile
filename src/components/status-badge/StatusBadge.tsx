import { StyleSheet, Text, View } from "react-native";
import { createThemedStyleSheet } from "@/shared/theme";

export type StatusBadgeProps = {
  label?: string;
  testID?: string;
  tone?: "active" | "warning" | "danger" | "info" | "neutral";
};

export const StatusBadge = ({ label = "Active", testID, tone = "active" }: StatusBadgeProps) => (
  <View style={[styles.badge, styles[`${tone}Badge`]]} testID={testID}>
    <Text style={[styles.text, styles[`${tone}Text`]]}>{label}</Text>
  </View>
);

const styles = createThemedStyleSheet({
  activeBadge: { backgroundColor: "#CFF8DF", borderColor: "#91E6B4" },
  activeText: { color: "#087A3B" },
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    height: 22,
    justifyContent: "center",
    paddingHorizontal: 11,
  },
  dangerBadge: { backgroundColor: "#FFE8DF", borderColor: "#FFB69E" },
  dangerText: { color: "#C8320D" },
  infoBadge: { backgroundColor: "#E8F7FF", borderColor: "#BFE8FF" },
  infoText: { color: "#1479B8" },
  neutralBadge: { backgroundColor: "#F1EFED", borderColor: "#E1DBD5" },
  neutralText: { color: "#6C5A51" },
  text: {
    fontSize: 10,
    fontWeight: "900",
  },
  warningBadge: { backgroundColor: "#FFF0C9", borderColor: "#F3DE98" },
  warningText: { color: "#9A6A00" },
});

