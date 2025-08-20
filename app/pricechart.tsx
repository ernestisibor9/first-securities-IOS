import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function PriceChart() {
  const router = useRouter();
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedStockName, setSelectedStockName] = useState<string>("");
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loadingChart, setLoadingChart] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // ✅ Load favorites from storage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem("favorites");
        if (stored) setFavorites(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    };
    loadFavorites();
  }, []);

  // ✅ Fetch stock list
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://regencyng.net/fs-api/proxy.php?type=stocks");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          return;
        }

        setStocks(data);
        if (data.length > 0) {
          setSelectedStock(data[0].id);
          setSelectedStockName(data[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
      }
    };
    fetchStocks();
  }, []);

  // ✅ Fetch chart data when stock changes
  useEffect(() => {
    if (!selectedStock) return;

    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const res = await fetch(
          `https://regencyng.net/fs-api/proxy.php?stock=${selectedStock}&type=stock_chart`
        );
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Chart API did not return an array:", data);
          setChartData({ labels: [], data: [] });
          setLoadingChart(false);
          return;
        }

        // Format dates → "Feb 17"
        const labels = data.map((item) => {
          const [day, month, year] = item.date.split("/");
          const date = new Date(`${year}-${month}-${day}`);
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        });

        const prices = data.map((item) => Number(item.price));
        setChartData({ labels, data: prices });

        const stockObj = stocks.find((s) => s.id === selectedStock);
        if (stockObj) setSelectedStockName(stockObj.name);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
        setChartData({ labels: [], data: [] });
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [selectedStock]);

  // ✅ Toggle favorites (no notifications)
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
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const getReducedLabels = (labels: string[]) =>
    labels.map((label, index) => (index % 1 === 0 ? label : ""));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Price Chart</Text>

        {/* ⭐ Favorite Button */}
        {selectedStock && (
          <TouchableOpacity onPress={toggleFavorite} style={{ marginLeft: "auto" }}>
            <Feather
              name={favorites.includes(selectedStock) ? "star" : "star-outline"}
              size={22}
              color={favorites.includes(selectedStock) ? "#FFD700" : "#002B5B"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Stock Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedStock}
          onValueChange={(itemValue) => {
            setSelectedStock(itemValue);
            const stockObj = stocks.find((s) => s.id === itemValue);
            if (stockObj) setSelectedStockName(stockObj.name);
          }}
          style={{ width: "100%", height: 50 }}
        >
          {stocks.map((stock) => (
            <Picker.Item key={stock.id} label={stock.name} value={stock.id} />
          ))}
        </Picker>
      </View>

      {/* Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Stock Chart</Text>
        {loadingChart ? (
          <ActivityIndicator size="large" color="#002B5B" style={{ padding: 50 }} />
        ) : chartData.data.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={{
                labels: getReducedLabels(chartData.labels),
                datasets: [
                  {
                    data: chartData.data,
                    color: (opacity = 1) => `rgba(0,0,128,${opacity})`,
                  },
                ],
              }}
              width={chartData.labels.length * 80}
              height={250}
              yAxisLabel="₦"
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 128, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#000080" },
                propsForBackgroundLines: { stroke: "#ccc" },
              }}
              bezier
              style={{ borderRadius: 8 }}
              fromZero
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
          {selectedStockName} — Price (₦) — Last 6 Months
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 50,
    marginBottom: 40,
    width: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10,
  },
  pickerContainer: {
    width: width - 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  stockInfo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#002B5B",
    textAlign: "center",
    marginTop: 10,
  },
});
