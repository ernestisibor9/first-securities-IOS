// PriceAlert.js
import React, { useState, useEffect } from "react";
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
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import * as ScreenOrientation from "expo-screen-orientation";

const PriceAlert = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";
  const { width, height } = useWindowDimensions();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Enable automatic orientation
  useEffect(() => {
    const enableAutoRotate = async () => {
      await ScreenOrientation.unlockAsync();
    };
    enableAutoRotate();

    const subscription = ScreenOrientation.addOrientationChangeListener(() => {
      // re-render on orientation change (no manual layout calc needed)
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const isValidEmail = (e) => !!e && e.includes("@");

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
        } catch (err) {}

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("OTP Sent", "A verification code has been sent to your email.");
        router.push({ pathname: "/verifyemail", params: { email } });
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Error", data?.message || "Failed to send OTP. Try again.");
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
        <View
          style={[
            styles(width, height).container,
            dark && styles(width, height).containerDark,
          ]}
        >
          {/* Header */}
          <View style={styles(width, height).header}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
            >
              <Feather
                name="arrow-left"
                size={22}
                color={dark ? "#fff" : "#002B5B"}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles(width, height).headerTitle,
                dark && { color: "#fff" },
              ]}
            >
              First Securities Brokers
            </Text>
          </View>

          {/* Content */}
          <View style={styles(width, height).content}>
            <Text style={[styles(width, height).title, dark && { color: "#fff" }]}>
              Please provide your email address
            </Text>
            <Text
              style={[styles(width, height).subtitle, dark && { color: "#ccc" }]}
            >
              This is required to confirm your identity
            </Text>

            <TextInput
              style={[styles(width, height).input, dark && styles(width, height).inputDark]}
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
            style={[
              styles(width, height).button,
              (loading || !isValidEmail(email)) && styles(width, height).buttonDisabled,
            ]}
            onPress={sendOtp}
            disabled={loading || !isValidEmail(email)}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles(width, height).buttonText}>CONTINUE</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PriceAlert;

const styles = (width, height) =>
  StyleSheet.create({
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
      fontSize: width * 0.04,
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
      fontSize: width * 0.045,
      fontWeight: "600",
      marginBottom: 6,
      color: "#000",
    },
    subtitle: {
      fontSize: width * 0.038,
      color: "#666",
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 6,
      padding: 12,
      fontSize: width * 0.04,
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
      fontSize: width * 0.045,
    },
  });
