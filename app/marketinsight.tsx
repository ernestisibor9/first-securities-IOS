  import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const marketinsight = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  const insights = [
    {
      title: "High dividend yield stocks to watch in September 2024",
      desc: "Discover which stocks are offering exceptional dividend yields this month and why they might be worth adding to your portfolio.",
      url: "https://nairametrics.com/2024/09/08/high-dividend...",
      time: "a year ago",
    },
    {
      title: "Nigerian Stocks with the best dividend yield 2024",
      desc: "Comprehensive analysis of top-performing dividend stocks in the Nigerian market for long-term investors.",
      url: "https://nairametrics.com/2024/07/01/nigerian-stocks...",
      time: "a year ago",
    },
    {
      title:
        "Top Nigerian insurance firms pay ₦40.439 billion in claims in Q1 2024",
      desc: "Insurance sector shows strength as leading companies honor claims amidst economic challenges.",
      url: "https://nairametrics.com/2024/07/17/top-nigerian...",
      time: "11 months ago",
    },
    {
      title:
        "Windfall tax spooks investors as bank stocks fall to lowest level in a month",
      desc: "Market reacts to new tax policies with banking sector taking the biggest hit.",
      url: "https://nairametrics.com/2024/07/28/windfall-tax...",
      time: "10 months ago",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#002B5B" />
        <Text style={styles.loadingText}>Loading Market Insights...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header Bar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.header}>Market Insight</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Feather name="bell" size={22} color="#002B5B" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {insights.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <Text style={styles.link}>{item.url}</Text>
            </TouchableOpacity>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>

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
            <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
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
    </View>
  );
};

export default marketinsight;

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
    marginTop: 40,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002B5B",
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#F5F7FA",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
  },
  link: {
    fontSize: 12,
    color: "#1E90FF",
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
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
 