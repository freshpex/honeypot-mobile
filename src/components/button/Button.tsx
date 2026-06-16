import type { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type ButtonProps = PropsWithChildren<
  PressableProps & {
    isLoading?: boolean;
    label?: string;
    style?: StyleProp<ViewStyle>;
    textColor?: string;
  }
> & {
  testID?: string;
};

export const Button = ({
  children,
  disabled,
  isLoading,
  label,
  style,
  testID,
  textColor = "#FFFFFF",
  ...pressableProps
}: ButtonProps) => (
  <Pressable
    {...pressableProps}
    disabled={disabled || isLoading}
    style={({ pressed }) => [
      styles.base,
      pressed && styles.pressed,
      (disabled || isLoading) && styles.disabled,
      style,
    ]}
    testID={testID}
  >
    {isLoading ? (
      <ActivityIndicator color={textColor} size="small" />
    ) : (
      <Text style={[styles.label, { color: textColor }]}>{children ?? label}</Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 8,
    height: 35,
    justifyContent: "center",
    shadowColor: "#FF4A17",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  disabled: {
    opacity: 0.7,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
});

