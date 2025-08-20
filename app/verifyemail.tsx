// VerifyEmail.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  useColorScheme,
  Keyboard,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendCount, setResendCount] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputs = useRef([]);
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";

  // Focus first input on mount
  useEffect(() => {
    const t = setTimeout(() => {
      if (inputs.current[0]) inputs.current[0].focus();
    }, 200);
    return () => clearTimeout(t);
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    let interval = null;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResendDisabled, timer]);

  // Update a single digit
  const handleChange = (text, index) => {
    // Only keep digits
    const sanitized = text.replace(/[^0-9]/g, "");
    if (sanitized.length > 1) {
      // If user pasted entire OTP, try to fill all
      const digits = sanitized.split("").slice(0, 6);
      const newCode = [...code];
      for (let i = 0; i < digits.length; i++) newCode[i] = digits[i];
      setCode(newCode);
      // focus next empty
      const next = digits.length < 6 ? digits.length : 5;
      inputs.current[next]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = sanitized;
    setCode(newCode);

    if (sanitized && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move to previous input
  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const validateOtpFormat = (otp) => /^\d{6}$/.test(otp);

  const handleVerify = async () => {
    const otp = code.join("").trim();

    if (!validateOtpFormat(otp)) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();

      const response = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=daily_alert_confirmation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      // Defensive parse
      const data = await response.json().catch(() => null);
      console.log("Verify OTP response:", data);

      // Decide success if API says status === "ok"
      if (data && data.status === "ok") {
        // Save a verified flag or email securely
        try {
          await SecureStore.setItemAsync("verifiedEmail", String(email || ""));
        } catch (err) {
          console.warn("SecureStore save failed:", err);
        }

        // Haptic success + modal
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
          /* ignore haptics failure */
        }

        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          // Replace to home / index
          router.replace("/");
        }, 7000);
      } else if (data && data.status === "not ok") {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch (e) {}
        Alert.alert("Invalid OTP", "The code you entered is incorrect. Please try again.");
      } else {
        // Unexpected response; show generic helpful message
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (e) {}
        Alert.alert("Verification failed", data?.message || "Unexpected response. Try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Network Error", "Unable to verify at the moment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      Alert.alert("Limit reached", "You have reached the maximum resend attempts.");
      return;
    }

    try {
      setIsResendDisabled(true);
      setTimer(60);

      const response = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=daily_alert",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json().catch(() => null);
      console.log("Resend response:", data);

      // Some endpoints return { otp: "xxxxx" } or { status: "ok" }
      const success = data && (data.otp || data.status === "ok");

      if (success) {
        setResendCount((c) => c + 1);
        try {
          Haptics.selectionAsync();
        } catch (e) {}
        Alert.alert("OTP Sent", "A new code has been sent to your email.");
        // optionally clear input boxes
        setCode(["", "", "", "", "", ""]);
        // focus first
        setTimeout(() => inputs.current[0]?.focus(), 200);
      } else {
        setIsResendDisabled(false);
        Alert.alert("Resend failed", data?.message || "Failed to resend OTP. Try again later.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setIsResendDisabled(false);
      Alert.alert("Network Error", "Unable to resend OTP. Try again later.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[styles.header, dark && styles.headerDark]}>
          <TouchableOpacity accessible accessibilityLabel="Go back" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={dark ? "#fff" : "black"} />
          </TouchableOpacity>
          <Text style={[styles.headerText, dark && styles.headerTextDark]}>Verify Email</Text>
        </View>

        <View style={[styles.content, dark && styles.contentDark]}>
          <Text style={[styles.title, dark && styles.titleDark]}>Check your email</Text>
          <Text style={[styles.subtitle, dark && styles.subtitleDark]}>We just sent you a mail</Text>
          <Text style={[styles.subtitle, dark && styles.subtitleDark]}>
            Enter the 6-digit code to verify your account
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={[styles.codeInput, dark && styles.codeInputDark]}
                maxLength={1}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                returnKeyType="done"
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                value={digit}
                accessible
                accessibilityLabel={`OTP digit ${index + 1}`}
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Verify code"
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyButtonText}>VERIFY</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isResendDisabled || resendCount >= 3}
            onPress={handleResend}
            accessibilityRole="button"
            accessibilityLabel="Resend code"
            style={{ marginTop: 12 }}
          >
            <Text
              style={[
                styles.resendText,
                (isResendDisabled || resendCount >= 3) && { color: "#aaa" },
                dark && { color: isResendDisabled || resendCount >= 3 ? "#777" : "#8fbfff" },
              ]}
            >
              {resendCount >= 3 ? "Resend limit reached" : isResendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, dark && styles.modalBoxDark]}>
            <Text style={[styles.modalText, dark && styles.modalTextDark]}>
              ✅ Congratulations! You have been successfully added to our Market News Alert subscription service.
              Stay tuned for regular updates!
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  containerDark: { backgroundColor: "#071022" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  headerDark: { backgroundColor: "#071022" },
  headerText: { fontSize: 16, fontWeight: "600", marginLeft: 10, color: "#000" },
  headerTextDark: { color: "#fff" },

  content: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 60,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },
  contentDark: { backgroundColor: "#0b1722" },

  title: { fontSize: 22, fontWeight: "600", marginBottom: 5, color: "#000" },
  titleDark: { color: "#fff" },

  subtitle: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 2 },
  subtitleDark: { color: "#cdd7e6" },

  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: 45,
    height: 50,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    color: "#000",
  },
  codeInputDark: {
    borderColor: "#22303b",
    backgroundColor: "#071022",
    color: "#fff",
  },

  verifyButton: {
    backgroundColor: "#002D62",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 6,
    marginVertical: 10,
  },
  verifyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  buttonDisabled: { opacity: 0.7 },

  resendText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: "600",
    color: "#004AAD",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 24,
  },
  modalBoxDark: { backgroundColor: "#072231" },

  modalText: { fontSize: 16, fontWeight: "600", color: "green", textAlign: "center" },
  modalTextDark: { color: "#9fe19f" },
});
