// App.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function App() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const router = useRouter();

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
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
          <TouchableOpacity style={styles.verifyButton}>
            <Text style={styles.verifyButtonText}>VERIFY</Text>
          </TouchableOpacity>

          {/* Resend */}
          <Text style={styles.resendText}>
            Didn't receive code?{" "}
            <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  content: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 60,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 5,
  },
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
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendText: {
    marginTop: 15,
    fontSize: 14,
    color: "#555",
  },
  resendLink: {
    color: "#004AAD",
    fontWeight: "600",
  },
});
