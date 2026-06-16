import { Ionicons } from "@expo/vector-icons";
import type { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { skeuo } from "@/shared/theme";

type AuthScreenShellProps = PropsWithChildren<{
  iconName: keyof typeof Ionicons.glyphMap;
  subtitle: string;
  title: string;
}>;

export const AuthScreenShell = ({
  children,
  iconName,
  subtitle,
  title,
}: AuthScreenShellProps) => (
  <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      style={styles.keyboard}
    >
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroIcon}>
          <Ionicons color="#FFFFFF" name={iconName} size={20} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

export const authScreenStyles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 10,
    paddingHorizontal: 24,
    paddingVertical: 24,
    ...skeuo.deepCard,
    maxWidth: 360,
    minWidth: 312,
    width: "88%",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    marginTop: 22,
  },
  footerLink: {
    color: "#FF4A17",
    fontSize: 13,
    fontWeight: "700",
  },
  footerText: {
    color: "#817B75",
    fontSize: 13,
  },
  inlineError: {
    color: "#D33B14",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 12,
    textAlign: "center",
  },
});

const styles = StyleSheet.create({
  heroIcon: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 12,
    borderColor: "#FF8B68",
    borderTopWidth: 1,
    elevation: 7,
    height: 44,
    justifyContent: "center",
    marginBottom: 12,
    ...skeuo.action,
    width: 44,
  },
  keyboard: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    backgroundColor: "#FAF9F8",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 30,
    paddingHorizontal: 18,
    paddingTop: 26,
  },
  subtitle: {
    color: "#817B75",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 28,
    textAlign: "center",
  },
  title: {
    color: "#161616",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 31,
    textAlign: "center",
  },
});
