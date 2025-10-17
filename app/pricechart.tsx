import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-gifted-charts";
import * as ScreenOrientation from "expo-screen-orientation";

export default function PriceChart() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();

  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedStockName, setSelectedStockName] = useState<string>("");
  const [chartData, setChartData] = useState<{ date: Date; price: number }[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem("favorites");
        if (stored) setFavorites(JSON.parse(stored));
      } catch (err) {
      }
    };
    loadFavorites();
  }, []);

  const safeJson = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response from API");
    }
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://regencyng.net/fs-api/proxy.php?type=stocks");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await safeJson(res);

        if (Array.isArray(data)) {
          setStocks(data);

          const accesscorp = data.find((s) => s.name?.toUpperCase() === "ACCESSCORP");
          if (accesscorp) {
            setSelectedStock(accesscorp.id);
            setSelectedStockName(accesscorp.name);
          } else if (data.length > 0) {
            setSelectedStock(data[0].id);
            setSelectedStockName(data[0].name);
          }
        }
      } catch (err: any) {
        Alert.alert("Error", "Unable to fetch stock list. Try again later.");
      }
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    if (!selectedStock) return;

    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const res = await fetch(
          `https://regencyng.net/fs-api/proxy.php?stock=${selectedStock}&type=stock_chart`
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await safeJson(res);

        if (Array.isArray(data)) {
          const parsedData = data
            .map((item) => {
              try {
                const [day, month, year] = item.date.split("/");
                return {
                  date: new Date(`${year}-${month}-${day}`),
                  price: Number(item.price),
                };
              } catch {
                return null;
              }
            })
            .filter(Boolean) as { date: Date; price: number }[];

          const cutoff = new Date();
          cutoff.setMonth(cutoff.getMonth() - 6);
          const filtered = parsedData.filter((d) => d.date >= cutoff);
          setChartData(filtered);
        } else {
          setChartData([]);
        }

        const stockObj = stocks.find((s) => s.id === selectedStock);
        if (stockObj) setSelectedStockName(stockObj.name);
      } catch (err: any) {
        Alert.alert("Error", "Unable to fetch chart data.");
        setChartData([]);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [selectedStock]);

  const toggleFavorite = async () => {
    try {
      let updated;
      if (favorites.includes(selectedStock!)) {
        updated = favorites.filter((id) => id !== selectedStock);
      } else {
        updated = [...favorites, selectedStock!];
      }
      setFavorites(updated);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    } catch (err: any) {
      Alert.alert("Error", "Unable to update favorites.");
    }
  };

  const chartPoints = chartData.map((item) => ({
    value: item.price,
    label: item.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  const prices = chartPoints.map((p) => p.value);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const dateRange = chartData.length
    ? `${chartData[0].date.toLocaleDateString("en-GB")} - ${chartData[chartData.length - 1].date.toLocaleDateString("en-GB")}`
    : "";

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { flexGrow: 1, justifyContent: "flex-end" }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Price Chart</Text>

        {selectedStock && (
          <TouchableOpacity onPress={toggleFavorite} style={{ marginLeft: "auto" }}>
            {favorites.includes(selectedStock) ? (
              <Feather name="star" size={22} color="#FFD700" />
            ) : (
              <Ionicons name="star-outline" size={22} color="#002B5B" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Stock Picker */}
      <View style={[styles.pickerWrapper, { width: width * 0.9 }]}>
        <RNPickerSelect
          onValueChange={(itemValue) => {
            setSelectedStock(itemValue);
            const stockObj = stocks.find((s) => s.id === itemValue);
            if (stockObj) setSelectedStockName(stockObj.name);
          }}
          items={stocks.map((stock) => ({
            label: stock.name,
            value: stock.id,
          }))}
          value={selectedStock}
          placeholder={{ label: "Select a stock...", value: null }}
          style={{
            inputIOS: { fontSize: 16, padding: 12 },
            inputAndroid: { fontSize: 16, padding: 12 },
            iconContainer: { right: 10, top: 15 },
          }}
          Icon={() => <Ionicons name="chevron-down" size={20} color="#666" />}
        />
      </View>

      {/* Chart */}
      <View
        style={[
          styles.chartCard,
          { width: width * 0.95, minHeight: height * 0.55 }, // 🔥 taller card
        ]}
      >
        <Text style={styles.chartTitle}>Stock Chart</Text>
        {loadingChart ? (
          <ActivityIndicator size="large" color="#002B5B" style={{ padding: 50 }} />
        ) : chartPoints.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <LineChart
              data={chartPoints}
              height={isLandscape ? height * 0.85 : height * 0.65} // 🔥 taller chart
              width={isLandscape ? width * 1.5 : Math.max(width, chartPoints.length * 60)}
              color="crimson"
              thickness={2}
              hideRules={false}
              hideDataPoints={false}
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor="crimson"
              yAxisLabel=""
              xAxisLabelTextStyle={{ fontSize: 10 }}
              yAxisTextStyle={{ fontSize: 10 }}
              xAxisColor="#ddd"
              yAxisColor="#ddd"
              showVerticalLines
              spacing={10}
              formatYLabel={(value) => `${value}`}
              yAxisOffset={minPrice}
              yAxisExtraHeight={(maxPrice - minPrice) * 0.1}
            />
          </ScrollView>
        ) : (
          <Text style={{ textAlign: "center", padding: 20 }}>
            No chart data available for this stock.
          </Text>
        )}
      </View>

      {/* Stock Info */}
      {selectedStockName ? (
        <Text style={styles.stockInfo}>
          {selectedStockName} — Price (₦) Last 6 Months — ({dateRange})
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5f5f5", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 40,
    marginBottom: 20,
    width: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    position: "relative",
    justifyContent: "center",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  stockInfo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#002B5B",
    textAlign: "center",
    marginTop: 10,
  },
});
