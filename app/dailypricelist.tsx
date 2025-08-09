// app/daily-price-list.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DailyPriceList() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setPrices([
        { id: "1", company: "ACCESSCORP", price: 27.9, change: 1.07 },
        { id: "2", company: "DANGCEM", price: 510.9, change: 3.67 },
        { id: "3", company: "FBNH", price: 35.0, change: 2.5 },
        { id: "4", company: "GTCO", price: 100.5, change: -1.42 },
        { id: "5", company: "MTNN", price: 425.0, change: 0.19 },
        { id: "6", company: "ZENITHBANK", price: 35.25, change: -3.16 },
      ]);
      setLoading(false);
    }, 2000);

    // Show modal after a delay (e.g., 3 seconds after data loads)
    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(modalTimer);
    };
  }, []);

  const handleSubscribe = () => {
    if (email.trim() === "") {
      alert("Please enter your email");
      return;
    }
    alert(`Subscribed successfully with ${email}`);
    setEmail("");
    setShowModal(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#002B5B" />
        <Text style={styles.loadingText}>Loading Daily Price List...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.header}>Daily Price List</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Feather name="bell" size={22} color="#002B5B" />
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Daily Price List - July 31, 2025</Text>

      {/* Price List */}
      <FlatList
        data={prices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const changeColor =
            item.change > 0 ? "green" : item.change < 0 ? "red" : "#555";
          return (
            <View style={styles.card}>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.price}>
                ₦{item.price.toFixed(2)}{" "}
                <Text style={{ color: changeColor }}>
                  | Chg: {item.change > 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </Text>
              </Text>
            </View>
          );
        }}
      />

      {/* Download Button */}
      <TouchableOpacity style={styles.downloadButton}>
        <Text style={styles.downloadText}>DOWNLOAD</Text>
      </TouchableOpacity>

      {/* Subscription Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Subscribe to our Newsletter</Text>
            <Text style={styles.modalText}>
              Stay updated with the latest market insights and stock news.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleSubscribe}
            >
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
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
  subtitle: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  company: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  downloadButton: {
    margin: 16,
    backgroundColor: "#002B5B",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#002B5B",
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  subscribeButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  closeText: {
    color: "#002B5B",
    fontWeight: "600",
  },
});
