import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { skeuo } from "@/shared/theme";
import type { ProfileStackParamList } from "@/app/profile/types";

type SupportScreenProps = NativeStackScreenProps<ProfileStackParamList, "Support">;

const faqs = [
  {
    answer:
      "Go to the Meals tab, tap 'Choose Meals' and select your preferred meal for each day of the week.",
    question: "How do I choose my meals?",
  },
  {
    answer: "Yes, you can change your meal selection up until 6 PM the day before delivery.",
    question: "Can I change my meal after selecting?",
  },
  {
    answer:
      "Go to the Subscription tab and tap 'Pause Subscription'. You can choose a pause duration.",
    question: "How do I pause my subscription?",
  },
  {
    answer:
      "Your remaining meals are preserved while deliveries stop during the pause.",
    question: "What happens to my remaining meals when I pause?",
  },
  {
    answer: "Yes! Browse the menu and place one-off orders anytime.",
    question: "Can I place orders without a subscription?",
  },
  {
    answer: "We currently deliver to major areas in Lagos. Check our delivery zones in the app.",
    question: "What areas do you deliver to?",
  },
];

export const SupportScreen = (_props: SupportScreenProps) => {
  const [expandedQuestion, setExpandedQuestion] = useState<string>();
  const faqItems = useMemo(() => faqs, []);
  const faqPagination = usePagination(faqItems);

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contactRow}>
          <Pressable
            onPress={() => Linking.openURL("https://wa.me/2349054531822")}
            style={[styles.contactCard, styles.whatsappCard]}
          >
            <Ionicons color="#14B86E" name="logo-whatsapp" size={24} />
            <Text style={styles.contactTitle}>WhatsApp</Text>
            <Text style={styles.contactSubtitle}>Chat with us</Text>
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL("mailto:support@honeypot.ng")}
            style={[styles.contactCard, styles.emailCard]}
          >
            <Ionicons color="#34A8F4" name="mail-outline" size={24} />
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactSubtitle}>support@honeypot.ng</Text>
          </Pressable>
        </View>

        <View style={styles.faqHeader}>
          <Ionicons color="#FF4A17" name="help-circle-outline" size={15} />
          <Text style={styles.faqTitle}>FAQs</Text>
        </View>

        <View style={styles.faqList}>
          {faqPagination.pageItems.map((faq) => {
            const expanded = expandedQuestion === faq.question;
            return (
              <Pressable
                key={faq.question}
                onPress={() => setExpandedQuestion(expanded ? undefined : faq.question)}
                style={styles.faqItem}
              >
                <View style={styles.questionRow}>
                  <Text style={styles.questionText}>{faq.question}</Text>
                  <Ionicons
                    color="#837D77"
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={14}
                  />
                </View>
                {expanded ? <Text style={styles.answerText}>{faq.answer}</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <PaginationControls
          canGoNext={faqPagination.canGoNext}
          canGoPrevious={faqPagination.canGoPrevious}
          onNext={faqPagination.goNext}
          onPrevious={faqPagination.goPrevious}
          page={faqPagination.page}
          totalPages={faqPagination.totalPages}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  answerText: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
  },
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
  contactCard: {
    alignItems: "center",
    borderRadius: 9,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 4,
    flex: 1,
    height: 76,
    justifyContent: "center",
    ...skeuo.card,
  },
  contactRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 17,
  },
  contactSubtitle: {
    color: "#817B75",
    fontSize: 9,
    marginTop: 2,
  },
  contactTitle: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 6,
  },
  content: {
    paddingBottom: 90,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  emailCard: {
    backgroundColor: "#ECF8FF",
  },
  faqHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EFEAE6",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    paddingHorizontal: 12,
    paddingVertical: 12,
    ...skeuo.card,
  },
  faqList: {
    gap: 8,
    marginTop: 10,
  },
  faqTitle: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  questionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  questionText: {
    color: "#171513",
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    paddingRight: 10,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  title: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
  whatsappCard: {
    backgroundColor: "#EAFBF2",
  },
});

