import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

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

  // Countdown effect
  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join("");

    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=daily_alert_confirmation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }), // ✅ confirmation requires both
        }
      );

      const data = await response.json();
      console.log("Verify OTP Response:", data);

      if (data.status === "ok") {
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          router.replace("/");
        }, 3000);
      } else if (data.status === "not ok") {
        alert("❌ Invalid OTP. Please try again.");
      } else {
        alert("⚠️ Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      alert("❌ You have reached the maximum resend attempts.");
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

      const data = await response.json();
      console.log("Resend OTP Response:", data);

      if (data?.otp) {
        // ✅ success means we got an OTP
        setResendCount((prev) => prev + 1);
        alert("📧 A new OTP has been sent to your email.");
      } else {
        alert(data?.message || "⚠️ Failed to resend OTP. Try again later.");
        setIsResendDisabled(false);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Failed to resend OTP. Try again later.");
      setIsResendDisabled(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Verify Email</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>We just sent you a mail</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code to verify your account
          </Text>

          {/* Code Inputs */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.codeInput}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={(text) => handleChange(text, index)}
                value={digit}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>VERIFY</Text>
            )}
          </TouchableOpacity>

          {/* Resend */}
          <TouchableOpacity
            disabled={isResendDisabled || resendCount >= 3}
            onPress={handleResend}
          >
            <Text
              style={[
                styles.resendText,
                (isResendDisabled || resendCount >= 3) && { color: "#aaa" },
              ]}
            >
              {resendCount >= 3
                ? "Resend limit reached"
                : isResendDisabled
                ? `Resend in ${timer}s`
                : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              ✅ Congratulations! You have been successfully added to our Market
              News Alert subscription service. Stay tuned for regular updates!
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  headerText: { fontSize: 16, fontWeight: "600", marginLeft: 10 },
  content: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 60,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 5 },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 2,
  },
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
  },
  verifyButton: {
    backgroundColor: "#002D62",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 6,
    marginVertical: 10,
  },
  verifyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
  },
  modalText: { fontSize: 16, fontWeight: "600", color: "green" },
});
