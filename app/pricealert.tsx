import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PriceAlert = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    // Navigate to next step
    router.push("/verifyemail");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>First Securities Brokers</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Please provide your email address</Text>
        <Text style={styles.subtitle}>
          This is required to confirm your identity
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginVertical: 30,
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
  },
  button: {
    backgroundColor: "#002B5B",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
