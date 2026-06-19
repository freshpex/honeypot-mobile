import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components";
import { createThemedStyleSheet, resolveThemeColor, skeuo } from "@/shared/theme";

export const WalletScreen = () => (
  <Screen>
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons color={resolveThemeColor("#FF4A17")} name="wallet-outline" size={28} />
      </View>
      <Text style={styles.title}>HoneyPot Wallet</Text>
      <Text style={styles.badge}>Coming Soon</Text>
      <Text style={styles.copy}>
        Wallet funding and wallet payments are disabled for now. Do not send money to any wallet account until this feature is launched in-app.
      </Text>
    </View>
  </Screen>
);

const styles = createThemedStyleSheet({
  badge: {
    backgroundColor: "#FFF8DD",
    borderColor: "#F3DE98",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    color: "#9A6A00",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 10,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 7,
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
  copy: {
    color: "#817B75",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
    textAlign: "center",
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    marginBottom: 12,
    width: 54,
    ...skeuo.pressed,
  },
  title: {
    color: "#171513",
    fontSize: 20,
    fontWeight: "900",
  },
});

