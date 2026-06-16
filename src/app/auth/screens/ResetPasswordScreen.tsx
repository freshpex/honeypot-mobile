import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, FormField } from "@/components";
import { AuthScreenShell, authScreenStyles } from "../components";
import { useAuth } from "../hooks";
import type { AuthStackParamList } from "../types";

type ResetPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ResetPassword"
>;

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const ResetPasswordScreen = ({ navigation }: ResetPasswordScreenProps) => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();

  const error = useMemo(
    () => (submitted && !isEmail(email) ? "Enter a valid email address." : undefined),
    [email, submitted],
  );

  const handleReset = async () => {
    setSubmitted(true);
    setSuccessMessage(undefined);
    if (!isEmail(email)) {
      return;
    }
    const response = await auth.requestPasswordReset({ email });
    if (response) {
      setSuccessMessage(response.message ?? "If an account exists, a reset link has been sent.");
    }
  };

  return (
    <AuthScreenShell
      iconName="mail-outline"
      subtitle="We'll send you a link to reset it"
      title="Reset password"
    >
      <View style={authScreenStyles.card}>
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          error={error}
          iconName="mail-outline"
          keyboardType="email-address"
          label="Email address"
          onChangeText={setEmail}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />
        <Button isLoading={auth.isLoading} onPress={handleReset} style={styles.submitButton}>
          Send reset link
        </Button>
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        {auth.error ? <Text style={authScreenStyles.inlineError}>{auth.error}</Text> : null}
      </View>
      <Pressable onPress={() => navigation.navigate("Login")} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back to log in</Text>
      </Pressable>
    </AuthScreenShell>
  );
};

const styles = StyleSheet.create({
  backLink: {
    marginTop: 20,
    padding: 8,
  },
  backLinkText: {
    color: "#FF4A17",
    fontSize: 11,
    fontWeight: "500",
  },
  submitButton: {
    marginTop: 13,
    width: "100%",
  },
  successText: {
    color: "#2F7D32",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 12,
    textAlign: "center",
  },
});
