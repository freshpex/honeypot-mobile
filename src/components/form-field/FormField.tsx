import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  type TextInputProps,
  View,
} from "react-native";
import { skeuo } from "@/shared/theme";

export type FormFieldProps = TextInputProps & {
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  label?: string;
  testID?: string;
};

export const FormField = ({
  error,
  iconName,
  label,
  style,
  testID,
  ...inputProps
}: FormFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasPasswordToggle = Boolean(inputProps.secureTextEntry);
  const secureTextEntry = hasPasswordToggle && !isPasswordVisible;

  return (
    <View style={styles.wrapper} testID={testID}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, isFocused && styles.fieldFocused, error && styles.fieldError]}>
        {iconName ? <Ionicons color="#8F8983" name={iconName} size={17} /> : null}
        <TextInput
          {...inputProps}
          secureTextEntry={secureTextEntry}
          onBlur={(event) => {
            setIsFocused(false);
            inputProps.onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            inputProps.onFocus?.(event);
          }}
          placeholderTextColor="#8E8A86"
          selectionColor="#C8320D"
          style={[styles.input, style]}
        />
        {hasPasswordToggle ? (
          <Pressable
            hitSlop={10}
            onPress={() => setIsPasswordVisible((currentValue) => !currentValue)}
            style={styles.eyeButton}
          >
            <Ionicons
              color="#8E8A86"
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={19}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "#D33B14",
    fontSize: 11,
    marginTop: 5,
  },
  eyeButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 30,
  },
  field: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    borderColor: "#DEDAD6",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    flexDirection: "row",
    gap: 11,
    height: 44,
    paddingHorizontal: 14,
    ...skeuo.pressed,
  },
  fieldError: {
    borderColor: "#FF4A17",
  },
  fieldFocused: {
    borderColor: "#C8320D",
    borderWidth: 1,
  },
  input: {
    color: "#181817",
    flex: 1,
    fontSize: 14,
    height: "100%",
    padding: 0,
  },
  label: {
    color: "#191817",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
  },
  wrapper: {
    width: "100%",
  },
});

