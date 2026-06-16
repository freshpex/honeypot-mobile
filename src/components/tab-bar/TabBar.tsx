import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { skeuo } from "@/shared/theme";

export type TabBarProps = Partial<BottomTabBarProps> & {
  testID?: string;
};

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home-outline",
  Meals: "restaurant-outline",
  Orders: "cube-outline",
  Plan: "calendar-outline",
  Profile: "person-outline",
  Overview: "speedometer-outline",
  Users: "people-outline",
  AdminOrders: "bag-handle-outline",
  Logs: "document-text-outline",
  Settings: "settings-outline",
};

const activeIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Meals: "restaurant",
  Orders: "cube",
  Plan: "calendar",
  Profile: "person",
  Overview: "speedometer",
  Users: "people",
  AdminOrders: "bag-handle",
  Logs: "document-text",
  Settings: "settings",
};

export const TabBar = ({ descriptors, navigation, state, testID }: TabBarProps) => {
  const tabs = useMemo(() => state?.routes ?? [], [state?.routes]);

  if (!state || !navigation || !descriptors) {
    return <View style={styles.container} testID={testID} />;
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea} testID={testID}>
      <View style={styles.container}>
        {tabs.map((route, index) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key]?.options;
          const label =
            typeof options?.tabBarLabel === "string"
              ? options.tabBarLabel
              : options?.title ?? route.name;
          const color = isFocused ? "#FF4A17" : "#77716B";

          return (
            <Pressable
              accessibilityRole="button"
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  canPreventDefault: true,
                  target: route.key,
                  type: "tabPress",
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.item}
            >
              <View style={[styles.iconWrap, isFocused && styles.activeIconWrap]}>
                <Ionicons
                  color={color}
                  name={(isFocused ? activeIconMap : iconMap)[route.name] ?? "ellipse-outline"}
                  size={17}
                />
              </View>
              <Text style={[styles.label, isFocused && styles.activeLabel]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  activeIconWrap: {
    backgroundColor: "#FFE8DF",
    borderColor: "#FFD0C0",
    borderWidth: StyleSheet.hairlineWidth,
    ...skeuo.pressed,
  },
  activeLabel: {
    color: "#FF4A17",
    fontWeight: "700",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E9E4E0",
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    flexDirection: "row",
    height: 52,
    justifyContent: "space-around",
    paddingHorizontal: 6,
    shadowColor: "#201B18",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  item: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  label: {
    color: "#77716B",
    fontSize: 9,
    marginTop: 1,
  },
  safeArea: {
    backgroundColor: "#FFFFFF",
  },
});

