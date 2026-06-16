import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { createThemedStyleSheet, skeuo } from "@/shared/theme";

type PaginationControlsProps = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  page: number;
  totalPages: number;
};

export const PaginationControls = ({
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  page,
  totalPages,
}: PaginationControlsProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        disabled={!canGoPrevious}
        onPress={onPrevious}
        style={[styles.button, !canGoPrevious && styles.buttonDisabled]}
      >
        <Ionicons color={canGoPrevious ? "#171513" : "#B7B1AC"} name="chevron-back" size={14} />
      </Pressable>
      <Text style={styles.label}>
        Page {page} of {totalPages}
      </Text>
      <Pressable
        disabled={!canGoNext}
        onPress={onNext}
        style={[styles.button, !canGoNext && styles.buttonDisabled]}
      >
        <Ionicons color={canGoNext ? "#171513" : "#B7B1AC"} name="chevron-forward" size={14} />
      </Pressable>
    </View>
  );
};

const styles = createThemedStyleSheet({
  button: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    height: 28,
    justifyContent: "center",
    width: 28,
    ...skeuo.pressed,
  },
  buttonDisabled: {
    backgroundColor: "#F2EFED",
  },
  label: {
    color: "#706A65",
    fontSize: 11,
    fontWeight: "700",
  },
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginTop: 12,
  },
});
