import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

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

  return (
    <View style={styles.wrapper} testID={testID}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, isFocused && styles.fieldFocused, error && styles.fieldError]}>
        {iconName ? <Ionicons color="#9D9A96" name={iconName} size={14} /> : null}
        <TextInput
          {...inputProps}
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
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "#D33B14",
    fontSize: 10,
    marginTop: 4,
  },
  field: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    borderColor: "#DEDAD6",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    height: 35,
    paddingHorizontal: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
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
    fontSize: 11,
    height: "100%",
    padding: 0,
  },
  label: {
    color: "#191817",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },
  wrapper: {
    width: "100%",
  },
});

