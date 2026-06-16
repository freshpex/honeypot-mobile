import { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createThemedStyleSheet } from "@/shared/theme";

export type ScreenProps = {
  scrollable?: boolean;
  testID?: string;
} & PropsWithChildren;

export const Screen = ({ children, scrollable = true, testID }: ScreenProps) => {
  if (!scrollable) {
    return (
      <SafeAreaView edges={[]} style={styles.safeArea} testID={testID}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.safeArea} testID={testID}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = createThemedStyleSheet({
  content: {
    flexGrow: 1,
    paddingBottom: 28,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
});

