import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppearanceStore } from "@/shared/state";
import { skeuo } from "@/shared/theme";

type AppHeaderProps = {
  canGoBack?: boolean;
  title: string;
};

export const AppHeader = ({ canGoBack, title }: AppHeaderProps) => {
  const navigation = useNavigation();
  const mode = useAppearanceStore((state) => state.mode);
  const toggleMode = useAppearanceStore((state) => state.toggleMode);

  const openNotifications = () => {
    navigation.dispatch(CommonActions.navigate("Notifications"));
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={[styles.headerCard, mode === "dark" && styles.headerCardDark]}>
        <View style={styles.leftSide}>
          {canGoBack ? (
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons color={mode === "dark" ? "#FFFFFF" : "#171513"} name="chevron-back" size={20} />
            </Pressable>
          ) : null}
          <Text numberOfLines={1} style={[styles.title, mode === "dark" && styles.titleDark]}>
            {title}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={toggleMode}
            style={[styles.iconButton, mode === "dark" && styles.iconButtonDark]}
          >
            <Ionicons
              color={mode === "dark" ? "#FFC266" : "#171513"}
              name={mode === "dark" ? "sunny-outline" : "moon-outline"}
              size={18}
            />
          </Pressable>
          <Pressable
            onPress={openNotifications}
            style={[styles.iconButton, mode === "dark" && styles.iconButtonDark]}
          >
            <Ionicons color={mode === "dark" ? "#FFFFFF" : "#171513"} name="notifications-outline" size={18} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  backButton: {
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    width: 26,
  },
  headerCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 10,
    flexDirection: "row",
    height: 48,
    justifyContent: "space-between",
    marginHorizontal: 12,
    paddingLeft: 12,
    paddingRight: 10,
    ...skeuo.floating,
  },
  headerCardDark: {
    backgroundColor: "#171513",
    borderColor: "#302A26",
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#FAF9F8",
    borderColor: "#E8E2DD",
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  iconButtonDark: {
    backgroundColor: "#302A26",
    borderColor: "#4C433B",
  },
  leftSide: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    minWidth: 0,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    paddingBottom: 2,
  },
  title: {
    color: "#171513",
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
  },
  titleDark: {
    color: "#FFFFFF",
  },
});
