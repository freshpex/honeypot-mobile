import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { referralsService, type ReferralChannel } from "@/app/referrals/services";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import type { ProfileStackParamList } from "../types";

type ReferralProgramScreenProps = NativeStackScreenProps<ProfileStackParamList, "ReferralProgram">;

export const ReferralProgramScreen = (_props: ReferralProgramScreenProps) => {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("HP-O2E62C");
  const [rewardAmount, setRewardAmount] = useState(2000);

  useEffect(() => {
    let mounted = true;
    void referralsService
      .getMine()
      .then((referral) => {
        if (!mounted) return;
        setReferralCode(referral.code);
        setRewardAmount(referral.rewardAmount);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleShare = async (channel: ReferralChannel) => {
    await referralsService.share(channel);
    await Share.share({
      message: `Use my HoneyPot code ${referralCode} and get healthy meals delivered.`,
      title: `Share via ${channel}`,
    });
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.earnCard}>
          <Ionicons color={resolveThemeColor("#FF4A17")} name="share-social-outline" size={34} />
          <Text style={styles.earnTitle}>Share & Earn</Text>
          <Text style={styles.earnCopy}>
            Invite friends and both of you get ₦{rewardAmount.toLocaleString()} off your next order
          </Text>
          <View style={styles.codeCard}>
            <View>
              <Text style={styles.codeLabel}>YOUR CODE</Text>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>
            <Pressable onPress={handleCopy} style={styles.copyButton}>
              <Ionicons color={resolveThemeColor("#FF4A17")} name={copied ? "checkmark" : "copy-outline"} size={18} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.shareLabel}>Share via</Text>
        <View style={styles.shareRow}>
          {(["WhatsApp", "SMS", "Email"] satisfies ReferralChannel[]).map((channel) => (
            <Pressable
              key={channel}
              onPress={() => void handleShare(channel)}
              style={styles.shareButton}
            >
              <Text style={styles.shareButtonText}>{channel}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = createThemedStyleSheet({
  backButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  codeCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    minHeight: 58,
    paddingHorizontal: 13,
    width: "100%",
    ...skeuo.card,
  },
  codeLabel: {
    color: "#9A948F",
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 3,
  },
  codeText: {
    color: "#FF4A17",
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  copyButton: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 17,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 2,
    height: 34,
    justifyContent: "center",
    width: 34,
    ...skeuo.pressed,
  },
  earnCard: {
    alignItems: "center",
    backgroundColor: "#FFF0EA",
    borderColor: "#FFE0D4",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 6,
    marginTop: 17,
    paddingHorizontal: 16,
    paddingVertical: 19,
    ...skeuo.deepCard,
  },
  earnCopy: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 7,
    textAlign: "center",
  },
  earnTitle: {
    color: "#171513",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 9,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  shareButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    flex: 1,
    height: 36,
    justifyContent: "center",
    ...skeuo.card,
  },
  shareButtonText: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "800",
  },
  shareLabel: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 21,
  },
  shareRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  title: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
});
