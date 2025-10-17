import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  useColorScheme,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window"); // 📱 dynamic screen size
const CACHE_KEY = "daily_price_cache";

const DailyPriceList = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=daily_price"
      );
      const data = await res.json();
      setPriceData(data);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)); // save offline
    } catch (err) {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) setPriceData(JSON.parse(cached));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, []);

  const onRefresh = () => {
    Haptics.selectionAsync();
    setRefreshing(true);
    fetchPrices();
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = priceData?.stock.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = priceData
    ? Math.ceil(priceData.stock.length / itemsPerPage)
    : 0;

  return (
    <View style={[styles.container, dark && { backgroundColor: "#0b1220" }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather
            name="arrow-left"
            size={width * 0.05} // responsive size
            color={dark ? "#fff" : "#002B5B"}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dark && { color: "#fff" }]}>
          Daily Price List
        </Text>
        <TouchableOpacity onPress={fetchPrices}>
          <Feather
            name="refresh-ccw"
            size={width * 0.05}
            color={dark ? "#fff" : "#002B5B"}
          />
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#002B5B" />
          <Text style={{ marginTop: 10, color: dark ? "#ccc" : "#000" }}>
            Loading daily price list...
          </Text>
        </View>
      ) : priceData ? (
        <>
          <Text style={[styles.dateText, dark && { color: "#8fbfff" }]}>
            Daily Price List - {new Date(priceData.date).toDateString()}
          </Text>

          {/* Scrollable List w/ Refresh */}
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {currentItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.stockRow}
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                }
              >
                <Text style={[styles.stockName, dark && { color: "#fff" }]}>
                  {item.name}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Text style={[styles.stockPrice, dark && { color: "#ccc" }]}>
                    ₦{item.price.toFixed(2)} |{" "}
                  </Text>
                  <Text
                    style={{
                      color: item.change >= 0 ? "green" : "red",
                      fontWeight: "500",
                    }}
                  >
                    Chg: {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  style={[
                    styles.pageButton,
                    currentPage === 1 && { backgroundColor: "#ccc" },
                  ]}
                >
                  <Text style={styles.pageText}>Prev</Text>
                </TouchableOpacity>

                <Text style={styles.pageNumber}>
                  Page {currentPage} of {totalPages}
                </Text>

                <TouchableOpacity
                  disabled={currentPage === totalPages}
                  onPress={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  style={[
                    styles.pageButton,
                    currentPage === totalPages && { backgroundColor: "#ccc" },
                  ]}
                >
                  <Text style={styles.pageText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            color: dark ? "#ccc" : "#000",
          }}
        >
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
    paddingTop: height * 0.05, // responsive spacing
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.015,
    marginTop: height * 0.01,
  },
  headerTitle: {
    fontSize: width * 0.045, // responsive text
    fontWeight: "700",
    color: "#002B5B",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: width * 0.05,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: width * 0.04,
    marginTop: 4,
    color: "#002B5B",
  },
  stockRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  stockName: {
    fontSize: width * 0.04,
    fontWeight: "600",
    marginBottom: 4,
  },
  stockPrice: {
    fontSize: width * 0.035,
    color: "#333",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.02,
  },
  pageButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: "#002B5B",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageNumber: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
