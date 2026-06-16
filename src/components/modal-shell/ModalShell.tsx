import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";

export type ModalShellProps = {
  onClose?: () => void;
  subtitle?: string;
  testID?: string;
  title?: string;
} & PropsWithChildren;

export const ModalShell = ({
  children,
  onClose,
  subtitle,
  testID,
  title = "Details",
}: ModalShellProps) => {
  const insets = useSafeAreaInsets();

  return (
  <View style={styles.overlay}>
    {onClose ? <Pressable onPress={onClose} style={StyleSheet.absoluteFill} /> : null}
    <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 12, 24) }]} testID={testID}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons color={resolveThemeColor("#FF4A17")} name="close" size={16} />
        </Pressable>
      </View>
      {children}
    </View>
  </View>
  );
};

const styles = createThemedStyleSheet({
  closeButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFD1C1",
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: "center",
    width: 30,
    ...skeuo.pressed,
  },
  handle: {
    alignSelf: "center",
    backgroundColor: "#DCD6D0",
    borderRadius: 3,
    height: 4,
    marginBottom: 14,
    width: 42,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.76)",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FAF9F8",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 14,
    paddingBottom: 18,
    paddingHorizontal: 14,
    paddingTop: 10,
    ...skeuo.floating,
  },
  subtitle: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 3,
  },
  title: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
  },
});

