import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { createThemedStyleSheet, skeuo } from "@/shared/theme";

type GoogleAuthButtonProps = {
  disabled?: boolean;
  onPress: () => void;
};

export const GoogleAuthButton = ({ disabled, onPress }: GoogleAuthButtonProps) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      pressed && styles.pressed,
      disabled && styles.disabled,
    ]}
  >
    <View style={styles.contentRow}>
      <GoogleLogo />
      <Text style={styles.label}>Continue with Google</Text>
    </View>
  </Pressable>
);

const GoogleLogo = () => (
  <View style={styles.googleMark}>
    <Svg height={14} viewBox="0 0 48 48" width={14}>
      <Path
        d="M44.5 20H24v8.5h11.8C34.7 34 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.2 0 6.2 1.2 8.5 3.2l6-6C34.7 4.9 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z"
        fill="#FFC107"
      />
      <Path
        d="M6.1 14.1l7 5.1C15 14.5 19.2 11 24 11c3.2 0 6.2 1.2 8.5 3.2l6-6C34.7 4.9 29.6 3 24 3 16 3 9.1 7.5 6.1 14.1z"
        fill="#FF3D00"
      />
      <Path
        d="M24 45c5.5 0 10.5-1.8 14.3-5l-6.6-5.6C29.5 36 26.9 37 24 37c-5.9 0-10.7-3.8-12.4-9.1l-6.9 5.3C8 40.2 15.5 45 24 45z"
        fill="#4CAF50"
      />
      <Path
        d="M44.5 20H24v8.5h11.8c-.5 2.5-1.9 4.5-4 5.9l6.6 5.6C42.1 36.5 45 31.3 45 24c0-1.3-.2-2.7-.5-4z"
        fill="#1976D2"
      />
    </Svg>
  </View>
);

const styles = createThemedStyleSheet({
  button: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderColor: "#DEDAD6",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    height: 44,
    justifyContent: "center",
    ...skeuo.card,
    width: "100%",
  },
  contentRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.75,
  },
  googleMark: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  label: {
    color: "#161616",
    fontSize: 13,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.9,
  },
});
