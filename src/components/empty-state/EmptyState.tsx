import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { skeuo } from "@/shared/theme";

export type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  message?: string;
  onActionPress?: () => void;
  actionLabel?: string;
  testID?: string;
  title?: string;
};

export const EmptyState = ({
  actionLabel,
  icon = "file-tray-outline",
  message = "When items are available, they will show up here.",
  onActionPress,
  testID,
  title = "Nothing here yet",
}: EmptyStateProps) => (
  <View style={styles.container} testID={testID}>
    <View style={styles.iconWrap}>
      <Ionicons color="#C9C5C1" name={icon} size={28} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && onActionPress ? (
      <Pressable onPress={onActionPress} style={styles.actionButton}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderColor: "#FF8B68",
    borderRadius: 9,
    borderTopWidth: 1,
    elevation: 6,
    height: 38,
    justifyContent: "center",
    marginTop: 16,
    minWidth: 138,
    paddingHorizontal: 16,
    ...skeuo.action,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 14,
    borderTopWidth: 1,
    elevation: 4,
    paddingHorizontal: 20,
    paddingVertical: 26,
    ...skeuo.card,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#FAF9F8",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    marginBottom: 12,
    width: 54,
    ...skeuo.pressed,
  },
  message: {
    color: "#817B75",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  title: {
    color: "#171513",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 5,
  },
});

