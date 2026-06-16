import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, FormField } from "@/components";
import { demoUsers } from "@/shared/state";
import { createThemedStyleSheet, skeuo } from "@/shared/theme";
import {
  AuthScreenShell,
  GoogleAuthButton,
  authScreenStyles,
} from "../components";
import { useAuth } from "../hooks";
import type { AuthStackParamList } from "../types";

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const auth = useAuth();
  const demoCustomer = demoUsers[0];
  const demoAdmin = demoUsers[1];
  const [email, setEmail] = useState(demoCustomer.email);
  const [password, setPassword] = useState(demoCustomer.password);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(
    () => ({
      email: submitted && !isEmail(email) ? "Enter a valid email address." : undefined,
      password: submitted && password.length < 8 ? "Password must be at least 8 characters." : undefined,
    }),
    [email, password, submitted],
  );

  const handleLogin = async () => {
    setSubmitted(true);
    if (!isEmail(email) || password.length < 8) {
      return;
    }
    await auth.login({ email, password });
  };

  const handleAdminDemo = async () => {
    setSubmitted(true);
    setEmail(demoAdmin.email);
    setPassword(demoAdmin.password);
    await auth.login({ email: demoAdmin.email, password: demoAdmin.password });
  };

  return (
    <AuthScreenShell
      iconName="log-in-outline"
      subtitle="Log in to your account"
      title="Welcome back"
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
        <View style={styles.passwordLabelRow}>
          <Text style={styles.passwordLabel}>Password</Text>
          <Pressable onPress={() => navigation.navigate("ResetPassword")}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </View>
        <FormField
          autoCapitalize="none"
          autoComplete="password"
          error={errors.password}
          iconName="lock-closed-outline"
          onChangeText={setPassword}
          placeholder="********"
          secureTextEntry
          textContentType="password"
          value={password}
        />
        <Button isLoading={auth.isLoading} onPress={handleLogin} style={styles.submitButton}>
          Log in
        </Button>
        <Pressable
          onPress={handleAdminDemo}
          style={styles.adminDemoButton}
        >
          <Text style={styles.adminDemoText}>Use admin demo</Text>
        </Pressable>
        {auth.error ? <Text style={authScreenStyles.inlineError}>{auth.error}</Text> : null}
      </View>
      <View style={authScreenStyles.footer}>
        <Text style={authScreenStyles.footerText}>{"Don't have an account?"}</Text>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={authScreenStyles.footerLink}>Create one</Text>
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

const styles = createThemedStyleSheet({
  dividerLine: {
    backgroundColor: "#E6E2DE",
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  adminDemoButton: {
    alignItems: "center",
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    height: 38,
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
    ...skeuo.pressed,
  },
  adminDemoText: {
    color: "#C8320D",
    fontSize: 12,
    fontWeight: "900",
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
    marginTop: 22,
    width: "100%",
  },
  dividerText: {
    color: "#8D8781",
    fontSize: 11,
    lineHeight: 14,
  },
  forgotText: {
    color: "#FF4A17",
    fontSize: 12,
    fontWeight: "700",
  },
  passwordLabel: {
    color: "#191817",
    fontSize: 13,
    fontWeight: "700",
  },
  passwordLabelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
    marginTop: 14,
  },
  submitButton: {
    marginTop: 16,
    width: "100%",
  },
});
