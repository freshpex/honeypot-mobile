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
import { skeuo } from "@/shared/theme";

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
    borderRadius: 10,
    borderColor: "#FF7A52",
    borderTopWidth: 1,
    elevation: 6,
    height: 44,
    justifyContent: "center",
    ...skeuo.action,
  },
  disabled: {
    opacity: 0.7,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
});

