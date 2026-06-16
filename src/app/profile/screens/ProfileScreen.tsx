import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ProfileScreen = () => {
  const rows = useMemo(
    () => [
      {
        icon: "location-outline",
        title: "Delivery Addresses",
        subtitle: "Manage your addresses",
        color: "#16A3FF",
        tint: "#EAF7FF",
      },
      {
        icon: "heart-outline",
        title: "Dietary Preferences",
        subtitle: "Allergies & food preferences",
        color: "#2CC979",
        tint: "#EAFBF2",
      },
      {
        icon: "wallet-outline",
        title: "My Wallet",
        color: "#FFB020",
        tint: "#FFF4D8",
      },
      {
        icon: "card-outline",
        title: "Payment Methods",
        color: "#34A8F4",
        tint: "#EBF7FF",
      },
      {
        icon: "receipt-outline",
        title: "Payment History",
        color: "#8F8A85",
        tint: "#F1EFED",
      },
      {
        icon: "share-social-outline",
        title: "Referral Program",
        color: "#8F8A85",
        tint: "#F1EFED",
      },
      {
        icon: "help-circle-outline",
        title: "Support Center",
        color: "#8F8A85",
        tint: "#F1EFED",
      },
    ] satisfies Array<{
      color: string;
      icon: keyof typeof Ionicons.glyphMap;
      subtitle?: string;
      tint: string;
      title: string;
    }>,
    [],
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>E</Text>
          </View>
          <View>
            <Text style={styles.name}>Enoch</Text>
            <Text style={styles.email}>enoch.megatransact@gmail.com</Text>
          </View>
        </View>

        <View style={styles.rows}>
          {rows.map((row) => (
            <Pressable key={row.title} style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: row.tint }]}>
                <Ionicons color={row.color} name={row.icon} size={18} />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                {row.subtitle ? <Text style={styles.rowSubtitle}>{row.subtitle}</Text> : null}
              </View>
              <Ionicons color="#837D77" name="chevron-forward" size={17} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logout}>
          <Ionicons color="#FF4A17" name="log-out-outline" size={15} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  avatarText: {
    color: "#FF4A17",
    fontSize: 16,
    fontWeight: "800",
  },
  content: {
    paddingBottom: 30,
    paddingHorizontal: 8,
    paddingTop: 17,
  },
  email: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 3,
  },
  logout: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginTop: 22,
  },
  logoutText: {
    color: "#FF4A17",
    fontSize: 13,
    fontWeight: "500",
  },
  name: {
    color: "#171513",
    fontSize: 17,
    fontWeight: "800",
  },
  profileHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 13,
    marginBottom: 18,
  },
  row: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: 12,
  },
  rowIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 30,
    justifyContent: "center",
    marginRight: 12,
    width: 30,
  },
  rowSubtitle: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 2,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "800",
  },
  rows: {
    gap: 7,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
});

