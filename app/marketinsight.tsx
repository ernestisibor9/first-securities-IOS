import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MarketInsight = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    fetch("https://regencyng.net/fs-api/proxy.php?type=market")
      .then((res) => res.json())
      .then((data) => {
        setInsights(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching insights:", err);
        setLoading(false);
      });
  }, []);

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
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.header}>Market Insight</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {insights.map((item, idx) => {
          const shortContent = String(item.content || "");
          const displayContent =
            shortContent.length > 100
              ? shortContent.slice(0, 140) + "..."
              : shortContent;

          return (
            <View key={idx} style={styles.card}>
              <Text style={styles.title}>{String(item.title || "")}</Text>
              <Text style={styles.desc}>{displayContent}</Text>
              {item.url ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(String(item.url))}
                >
                  <Text style={styles.link}>{String(item.url)}</Text>
                </TouchableOpacity>
              ) : null}
              <Text style={styles.time}>{String(item.date || "")}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MarketInsight;

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
});
