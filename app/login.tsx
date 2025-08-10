import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    // Simulate sending email to backend
    Alert.alert("Subscribed!", `You will receive updates at ${email}`);
    setModalVisible(false);
    setEmail("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.header}>Login</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Feather name="bell" size={22} color="#002B5B" />
        </TouchableOpacity>
      </View>

      {/* Background Image with Login Card */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          source={require("../assets/images/loginback.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.card}>
            <Text style={styles.title}>FBNQuest Online Trader</Text>

            <TextInput
              style={styles.input}
              placeholder="username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInText}>SIGN IN</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.link}>Forgot your Password</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.link}>Create New Account (new customers)</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.link}>Request Access (returning customers)</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
              © 2025 FBNQuest Nigeria All Rights Reserved
            </Text>
          </View>
        </ImageBackground>
      </ScrollView>

      {/* Subscription Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Subscribe to Updates</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.signInButton} onPress={handleSubscribe}>
              <Text style={styles.signInText}>Subscribe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.signInButton, { backgroundColor: "#aaa" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.signInText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002B5B",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#002B5B",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  signInButton: {
    width: "100%",
    backgroundColor: "#002B5B",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 14,
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    fontSize: 13,
    color: "#002B5B",
    textAlign: "center",
    marginVertical: 2,
  },
  footer: {
    fontSize: 10,
    color: "#777",
    marginTop: 10,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#002B5B",
  },
});
