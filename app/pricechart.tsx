import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { LineChart } from "react-native-chart-kit";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PriceChart() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedStockName, setSelectedStockName] = useState<string>("");
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loadingChart, setLoadingChart] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites
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

  // Fetch stocks (default to Accesscorp)
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://regencyng.net/fs-api/proxy.php?type=stocks");
        const data = await res.json();

        if (Array.isArray(data)) {
          setStocks(data);

          const accesscorp = data.find((s) => s.name.toUpperCase() === "ACCESSCORP");
          if (accesscorp) {
            setSelectedStock(accesscorp.id);
            setSelectedStockName(accesscorp.name);
          } else if (data.length > 0) {
            setSelectedStock(data[0].id);
            setSelectedStockName(data[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
      }
    };
    fetchStocks();
  }, []);

  // Fetch chart data
  useEffect(() => {
    if (!selectedStock) return;

    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const res = await fetch(
          `https://regencyng.net/fs-api/proxy.php?stock=${selectedStock}&type=stock_chart`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const labels = data.map((item) => {
            const [day, month, year] = item.date.split("/");
            const date = new Date(`${year}-${month}-${day}`);
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          });
          const prices = data.map((item) => Number(item.price));
          setChartData({ labels, data: prices });
        } else {
          setChartData({ labels: [], data: [] });
        }

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: height * 0.05 }]}>
        {/* Header */}
        <View style={[styles.header, { marginTop: Platform.OS === "ios" ? 10 : 40 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={Math.min(width * 0.05, 22)} color="#002B5B" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: Math.min(width * 0.045, 18) }]}>
            Stock Price Chart
          </Text>

          {selectedStock && (
            <TouchableOpacity onPress={toggleFavorite} style={{ marginLeft: "auto" }}>
              <Feather
                name={favorites.includes(selectedStock) ? "star" : "star-outline"}
                size={Math.min(width * 0.05, 22)}
                color={favorites.includes(selectedStock) ? "#FFD700" : "#002B5B"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Picker */}
        <View style={[styles.pickerContainer, { width: width * 0.9 }]}>
          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedStock(value);
              const stockObj = stocks.find((s) => s.id === value);
              if (stockObj) setSelectedStockName(stockObj.name);
            }}
            items={stocks.map((s) => ({ label: s.name, value: s.id }))}
            value={selectedStock}
            placeholder={{ label: "Select a stock...", value: null }}
            style={{
              inputIOS: {
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                color: "#002B5B",
                paddingRight: 30, // space for chevron
              },
              inputAndroid: {
                fontSize: 16,
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                color: "#002B5B",
              },
            }}
            Icon={() => <Feather name="chevron-down" size={20} color="#002B5B" />}
          />
        </View>

        {/* Chart */}
        <View style={[styles.chartCard, { width: width * 0.95 }]}>
          <Text style={[styles.chartTitle, { fontSize: Math.min(width * 0.042, 16) }]}>
            Stock Chart
          </Text>
          {loadingChart ? (
            <ActivityIndicator size="large" color="#002B5B" style={{ padding: height * 0.05 }} />
          ) : chartData.data.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={{
                  labels: getReducedLabels(chartData.labels),
                  datasets: [{ data: chartData.data }],
                }}
                width={Math.max(width * 0.95, chartData.labels.length * 60)}
                height={Math.min(height * 0.35, 320)} // cap height for iPad
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
          <Text style={[styles.stockInfo, { fontSize: Math.min(width * 0.038, 15) }]}>
            {selectedStockName} — Price (₦) — Last 6 Months
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { padding: 16, alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 20,
    width: "100%",
  },
  headerTitle: {
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10,
  },
  pickerContainer: {
    marginBottom: 20,
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
  chartTitle: { fontWeight: "bold", marginBottom: 5, textAlign: "center" },
  stockInfo: {
    fontWeight: "600",
    color: "#002B5B",
    textAlign: "center",
    marginTop: 10,
  },
});
