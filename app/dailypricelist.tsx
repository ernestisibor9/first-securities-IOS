import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const DailyPriceList = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Number of records per page

  useEffect(() => {
    fetch("https://regencyng.net/proxy.php?type=daily_price")
      .then((res) => res.json())
      .then((data) => {
        setPriceData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching daily price list:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Pagination calculation
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = priceData?.stock.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = priceData
    ? Math.ceil(priceData.stock.length / itemsPerPage)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Price List</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#002B5B" />
          <Text style={{ marginTop: 10 }}>Loading daily price list...</Text>
        </View>
      ) : priceData ? (
        <>
          <Text style={styles.dateText}>
            Daily Price List - {formatDate(priceData.date)}
          </Text>

          <ScrollView style={{ flex: 1 }}>
            {currentItems.map((item, idx) => (
              <View key={idx} style={styles.stockRow}>
                <Text style={styles.stockName}>{item.name}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.stockPrice}>
                    ₦{item.price.toFixed(2)} |{" "}
                  </Text>
                  <Text
                    style={{
                      color: item.change >= 0 ? "green" : "red",
                      fontWeight: "500",
                    }}
                  >
                    <Text style={{ color: "black" }}>Chg: </Text>{" "}
                    {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Controls */}
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 1 && { opacity: 0.5 }]}
              onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.pageText}>Prev</Text>
            </TouchableOpacity>

            <Text style={styles.pageNumber}>
              {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === totalPages && { opacity: 0.5 },
              ]}
              onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.pageText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Failed to load data
        </Text>
      )}
    </View>
  );
};

export default DailyPriceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#002B5B",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 27,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 4,
    color: "#002B5B",
  },
  stockRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stockName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  stockPrice: {
    fontSize: 14,
    color: "#333",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom:30,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#002B5B",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
