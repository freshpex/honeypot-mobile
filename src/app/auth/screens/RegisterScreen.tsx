import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, FormField } from "@/components";
import {
  AuthScreenShell,
  GoogleAuthButton,
  authScreenStyles,
} from "../components";
import { useAuth } from "../hooks";
import type { AuthStackParamList } from "../types";

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, "Register">;

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(
    () => ({
      confirmPassword:
        submitted && confirmPassword !== password ? "Passwords must match." : undefined,
      email: submitted && !isEmail(email) ? "Enter a valid email address." : undefined,
      password: submitted && password.length < 8 ? "Password must be at least 8 characters." : undefined,
    }),
    [confirmPassword, email, password, submitted],
  );

  const handleRegister = async () => {
    setSubmitted(true);
    if (!isEmail(email) || password.length < 8 || password !== confirmPassword) {
      return;
    }
    await auth.register({ confirmPassword, email, password });
  };

  return (
    <AuthScreenShell
      iconName="person-add-outline"
      subtitle="Sign up to get started"
      title="Create your account"
    >
      <View style={authScreenStyles.card}>
        <GoogleAuthButton disabled={auth.isLoading} onPress={auth.continueWithGoogle} />
        <Divider />
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          iconName="mail-outline"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />
        <View style={styles.fieldGap}>
          <FormField
            autoCapitalize="none"
            autoComplete="new-password"
            error={errors.password}
            iconName="lock-closed-outline"
            label="Password"
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
            textContentType="newPassword"
            value={password}
          />
        </View>
        <View style={styles.fieldGap}>
          <FormField
            autoCapitalize="none"
            autoComplete="new-password"
            error={errors.confirmPassword}
            iconName="lock-closed-outline"
            label="Confirm Password"
            onChangeText={setConfirmPassword}
            placeholder="********"
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
          />
        </View>
        <Button isLoading={auth.isLoading} onPress={handleRegister} style={styles.submitButton}>
          Create account
        </Button>
        {auth.error ? <Text style={authScreenStyles.inlineError}>{auth.error}</Text> : null}
      </View>
      <View style={authScreenStyles.footer}>
        <Text style={authScreenStyles.footerText}>Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={authScreenStyles.footerLink}>Log in</Text>
        </Pressable>
      </View>
    </AuthScreenShell>
  );
};

const Divider = () => (
  <View style={styles.dividerRow}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>OR</Text>
    <View style={styles.dividerLine} />
  </View>
);

const styles = StyleSheet.create({
  dividerLine: {
    backgroundColor: "#E6E2DE",
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
    marginTop: 20,
    width: "100%",
  },
  dividerText: {
    color: "#8D8781",
    fontSize: 9,
    lineHeight: 11,
  },
  fieldGap: {
    marginTop: 13,
  },
  submitButton: {
    marginTop: 13,
    width: "100%",
  },
});
