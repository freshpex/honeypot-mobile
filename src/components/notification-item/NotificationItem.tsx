import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";

export type NotificationItemProps = {
  message?: string;
  title?: string;
  testID?: string;
  time?: string;
};

export const NotificationItem = ({
  message = "Your HoneyPot update will appear here.",
  testID,
  time = "Now",
  title = "Notification",
}: NotificationItemProps) => (
  <View style={styles.item} testID={testID}>
    <View style={styles.iconWrap}>
      <Ionicons color={resolveThemeColor("#FF4A17")} name="notifications-outline" size={18} />
    </View>
    <View style={styles.content}>
      <View style={styles.topRow}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text numberOfLines={2} style={styles.message}>
        {message}
      </Text>
    </View>
  </View>
);

const styles = createThemedStyleSheet({
  content: {
    flex: 1,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 11,
    height: 36,
    justifyContent: "center",
    marginRight: 11,
    width: 36,
    ...skeuo.pressed,
  },
  item: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderTopWidth: 1,
    elevation: 4,
    flexDirection: "row",
    padding: 12,
    ...skeuo.card,
  },
  message: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  time: {
    color: "#9D9690",
    fontSize: 10,
    fontWeight: "700",
  },
  title: {
    color: "#171513",
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});

