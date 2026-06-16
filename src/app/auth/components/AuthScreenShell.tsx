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
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderColor: "#DEDAD6",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 6,
    paddingHorizontal: 22,
    paddingVertical: 22,
    ...skeuo.deepCard,
    maxWidth: 328,
    minWidth: 299,
    width: "82%",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    marginTop: 20,
  },
  footerLink: {
    color: "#FF4A17",
    fontSize: 11,
    fontWeight: "500",
  },
  footerText: {
    color: "#817B75",
    fontSize: 11,
  },
  inlineError: {
    color: "#D33B14",
    fontSize: 11,
    lineHeight: 14,
    marginTop: 12,
    textAlign: "center",
  },
});

const styles = StyleSheet.create({
  heroIcon: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 10,
    borderColor: "#FF8B68",
    borderTopWidth: 1,
    elevation: 7,
    height: 39,
    justifyContent: "center",
    marginBottom: 12,
    ...skeuo.action,
    width: 39,
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
    paddingBottom: 34,
    paddingHorizontal: 18,
    paddingTop: 34,
  },
  subtitle: {
    color: "#817B75",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 32,
    textAlign: "center",
  },
  title: {
    color: "#161616",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 28,
    textAlign: "center",
  },
});
