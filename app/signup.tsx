import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const steps = ["PERSONAL", "NEXT OF KIN", "IDENTITY", "SUMMARY"];

export default function Signup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Form submitted:", form);
      // Here you can send form to API
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign Up</Text>
        <TouchableOpacity>
          <Feather name="bell" size={20} color="#002B5B" />
        </TouchableOpacity>
      </View>

      {/* Tab Menu */}
      <View style={styles.tabMenu}>
        {steps.map((tab, i) => (
          <Text
            key={i}
            style={[
              styles.tab,
              i === currentStep && styles.activeTab,
            ]}
          >
            {tab}
          </Text>
        ))}
      </View>

      {/* Step Content */}
      <View style={styles.formCard}>
        {currentStep === 0 && (
          <>
            <Text style={styles.formTitle}>
              Let's start with your Personal Info
            </Text>
            <Text style={styles.formSubtitle}>All fields marked required</Text>

            <Text style={styles.label}>Title (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="Select Title"
              value={form.title}
              onChangeText={(text) => handleChange("title", text)}
            />

            <Text style={styles.label}>First Name (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={form.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
            />

            <Text style={styles.label}>Middle Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Middle Name"
              value={form.middleName}
              onChangeText={(text) => handleChange("middleName", text)}
            />

            <Text style={styles.label}>Last Name (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={form.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
            />

            <Text style={styles.label}>Email (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
            />

            <Text style={styles.label}>Password (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />

            <Text style={styles.label}>Confirm Password (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />

            <Text style={styles.label}>Date of Birth (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={form.dob}
              onChangeText={(text) => handleChange("dob", text)}
            />

            <Text style={styles.label}>Gender (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="Select Gender"
              value={form.gender}
              onChangeText={(text) => handleChange("gender", text)}
            />
          </>
        )}

        {currentStep === 1 && (
          <Text style={styles.formTitle}>Next of Kin Information</Text>
        )}

        {currentStep === 2 && (
          <Text style={styles.formTitle}>Identity Verification</Text>
        )}

        {currentStep === 3 && (
          <Text style={styles.formTitle}>Summary</Text>
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.backButton]}
              onPress={handlePrev}
            >
              <Text style={styles.navButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "#002B5B" },
  tabMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
  },
  tab: { fontSize: 12, color: "#777" },
  activeTab: {
    color: "#002B5B",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#002B5B",
    paddingBottom: 4,
  },
  formCard: { padding: 16 },
  formTitle: { fontSize: 14, fontWeight: "bold", color: "#002B5B" },
  formSubtitle: { fontSize: 12, color: "#777", marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "500", color: "#002B5B", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 5,
  },
  nextButton: { backgroundColor: "#002B5B" },
  backButton: { backgroundColor: "#777" },
  navButtonText: { color: "#fff", fontWeight: "bold" },
});
