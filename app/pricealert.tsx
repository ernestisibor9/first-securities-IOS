// PriceAlert.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";

const PriceAlert = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (e: string) => !!e && e.includes("@");

  const sendOtp = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=daily_alert",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json().catch(() => null);
      const httpOk = res.ok;
      const apiOk = data && (data.status === "ok" || data.otp || data.message === "ok");

      if (httpOk || apiOk) {
        try {
          await SecureStore.setItemAsync("userEmail", email);
        } catch (err) {
          console.warn("SecureStore error:", err);
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("OTP Sent", "A verification code has been sent to your email.");
        router.push({ pathname: "/verifyemail", params: { email } });
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Error", data?.message || "Failed to send OTP. Try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Network Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, dark && styles.containerDark]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
              <Feather name="arrow-left" size={22} color={dark ? "#fff" : "#002B5B"} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, dark && { color: "#fff" }]}>
              First Securities Brokers
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.title, dark && { color: "#fff" }]}>
              Please provide your email address
            </Text>
            <Text style={[styles.subtitle, dark && { color: "#ccc" }]}>
              This is required to confirm your identity
            </Text>

            <TextInput
              style={[styles.input, dark && styles.inputDark]}
              placeholder="Email Address"
              placeholderTextColor={dark ? "#888" : "#999"}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              returnKeyType="send"
              onSubmitEditing={sendOtp}
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.button, (loading || !isValidEmail(email)) && styles.buttonDisabled]}
            onPress={sendOtp}
            disabled={loading || !isValidEmail(email)}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>CONTINUE</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PriceAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
    justifyContent: "space-between",
  },
  containerDark: {
    backgroundColor: "#071020",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: "#000",
  },
  inputDark: {
    borderColor: "#22303b",
    color: "#fff",
    backgroundColor: "#041022",
  },
  button: {
    backgroundColor: "#002B5B",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 55,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
