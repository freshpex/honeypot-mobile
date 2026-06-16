import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";

type IconName = keyof typeof Ionicons.glyphMap;

export type ModuleSurfaceProps = {
  actions?: string[];
  icon?: IconName;
  metric?: string;
  subtitle?: string;
  testID?: string;
  title: string;
  variant?: "screen" | "card" | "sheet" | "tab";
};

export const ModuleSurface = ({
  actions,
  icon = "sparkles-outline",
  metric = "Coming soon",
  subtitle = "This module is ready for backend wiring and production workflows.",
  testID,
  title,
  variant = "screen",
}: ModuleSurfaceProps) => {
  const chips = useMemo(() => actions ?? ["Local state", "API-ready", "Reusable UI"], [actions]);

  if (variant === "tab") {
    return (
      <View style={styles.tab} testID={testID}>
        <View style={styles.tabIcon}>
          <Ionicons color={resolveThemeColor("#FF4A17")} name={icon} size={15} />
        </View>
        <Text style={styles.tabText}>{title}</Text>
      </View>
    );
  }

  const card = (
    <View style={[styles.card, variant === "sheet" && styles.sheetCard]} testID={testID}>
      <View style={styles.iconWrap}>
        <Ionicons color={resolveThemeColor("#FF4A17")} name={icon} size={24} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.metricPill}>
        <Text style={styles.metricText}>{metric}</Text>
      </View>
      <View style={styles.chips}>
        {chips.map((chip) => (
          <View key={chip} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
      </View>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>View Details</Text>
      </Pressable>
    </View>
  );

  if (variant === "card" || variant === "sheet") {
    return card;
  }

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {card}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = createThemedStyleSheet({
  button: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#FF4A17",
    borderColor: "#FF8B68",
    borderRadius: 9,
    borderTopWidth: 1,
    elevation: 6,
    height: 40,
    justifyContent: "center",
    marginTop: 16,
    ...skeuo.action,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 16,
    borderTopWidth: 1,
    elevation: 7,
    padding: 20,
    ...skeuo.deepCard,
  },
  chip: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    paddingHorizontal: 10,
    paddingVertical: 7,
    ...skeuo.pressed,
  },
  chipText: {
    color: "#6C5A51",
    fontSize: 11,
    fontWeight: "800",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 14,
  },
  content: {
    paddingBottom: 28,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderColor: "#FFFFFF",
    borderRadius: 18,
    borderTopWidth: 1,
    elevation: 4,
    height: 54,
    justifyContent: "center",
    marginBottom: 12,
    width: 54,
    ...skeuo.pressed,
  },
  metricPill: {
    backgroundColor: "#FFF8DD",
    borderColor: "#F3DE98",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 14,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  metricText: {
    color: "#9A6A00",
    fontSize: 12,
    fontWeight: "900",
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  sheetCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  subtitle: {
    color: "#817B75",
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 280,
    textAlign: "center",
  },
  tab: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderTopWidth: 1,
    elevation: 3,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...skeuo.card,
  },
  tabIcon: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 9,
    height: 27,
    justifyContent: "center",
    width: 27,
  },
  tabText: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: "#171513",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },
});
