import { Ionicons } from "@expo/vector-icons";
import { PropsWithChildren } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createThemedStyleSheet, resolveThemeColor, skeuo } from "@/shared/theme";

export type Tone = "orange" | "green" | "blue" | "yellow" | "gray" | "red";

const toneColor: Record<Tone, string> = {
  blue: "#1A9BE8",
  gray: "#6C5A51",
  green: "#08A46B",
  orange: "#FF4A17",
  red: "#C8320D",
  yellow: "#E88700",
};

const toneTint: Record<Tone, string> = {
  blue: "#E8F7FF",
  gray: "#F1EFED",
  green: "#E8FBF3",
  orange: "#FFE8DF",
  red: "#FFE8DF",
  yellow: "#FFF8DD",
};

export const AdminScreen = ({ children }: PropsWithChildren) => (
  <SafeAreaView edges={[]} style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  </SafeAreaView>
);

export const AdminSectionTitle = ({ subtitle, title }: { subtitle?: string; title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

export const AdminMetricCard = ({
  icon,
  label,
  tone = "orange",
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tone?: Tone;
  value: string;
}) => (
  <View style={styles.metricCard}>
    <View style={[styles.metricIcon, { backgroundColor: resolveThemeColor(toneTint[tone]) }]}>
      <Ionicons color={resolveThemeColor(toneColor[tone])} name={icon} size={19} />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

export const AdminPill = ({ label, tone = "orange" }: { label: string; tone?: Tone }) => (
  <View
    style={[
      styles.pill,
      {
        backgroundColor: resolveThemeColor(toneTint[tone]),
        borderColor: resolveThemeColor(toneColor[tone]),
      },
    ]}
  >
    <Text style={[styles.pillText, { color: resolveThemeColor(toneColor[tone]) }]}>{label}</Text>
  </View>
);

export const AdminActionButton = ({
  children,
  onPress,
  tone = "orange",
}: PropsWithChildren<{ onPress?: () => void; tone?: Tone }>) => (
  <Pressable
    onPress={onPress}
    style={[styles.actionButton, tone === "green" && styles.greenButton]}
  >
    <Text style={styles.actionText}>{children}</Text>
  </Pressable>
);

export const AdminCard = ({ children }: PropsWithChildren) => (
  <View style={styles.card}>{children}</View>
);

const styles = createThemedStyleSheet({
  actionButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderColor: "#FF8B68",
    borderRadius: 9,
    borderTopWidth: 1,
    elevation: 6,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 14,
    ...skeuo.action,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 14,
    borderTopWidth: 1,
    elevation: 5,
    padding: 13,
    ...skeuo.card,
  },
  content: {
    gap: 12,
    paddingBottom: 28,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  greenButton: {
    backgroundColor: "#08A46B",
    borderColor: "#45D49D",
  },
  metricCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderTopWidth: 1,
    elevation: 4,
    flex: 1,
    minWidth: 96,
    minHeight: 92,
    padding: 10,
    ...skeuo.card,
  },
  metricIcon: {
    alignItems: "center",
    borderRadius: 11,
    height: 34,
    justifyContent: "center",
    marginBottom: 7,
    width: 34,
    ...skeuo.pressed,
  },
  metricLabel: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  metricValue: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
  },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "900",
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 3,
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
});
