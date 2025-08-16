import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const stocksData = {
  ABBEYBDS: {
    labels: ["Feb 7", "Mar 8", "Mar 27", "Apr 15", "May 4", "May 23", "Jun 11", "Jun 30", "Jul 19", "Aug 7"],
    data: [5.5, 5.7, 6.0, 6.2, 6.5, 6.3, 5.8, 5.2, 5.5, 5.8],
  },
  // Add more static stocks if needed
};

// Optional: reduce labels to avoid overlap
const getReducedLabels = (labels) => {
  return labels.map((label, index) => (index % 1 === 0 ? label : ""));
};

export default function PriceChart() {
  const router = useRouter();
  const [selectedStock, setSelectedStock] = useState("ABBEYBDS");
  const [stockOptions, setStockOptions] = useState([]);

useEffect(() => {
  const fetchStocks = async () => {
    try {
      const response = await fetch("https://regencyng.net/proxy.php?type=stocks");
      const text = await response.text(); // get raw response
      let data;
      try {
        data = JSON.parse(text); // parse it safely
      } catch (err) {
        console.error("Failed to parse JSON:", err, "Response text:", text);
        return;
      }

      if (!Array.isArray(data)) {
        console.error("API did not return an array:", data);
        return;
      }

      // Map array to get stock names
      const stockNames = data.map((item) => item.name);
      setStockOptions(stockNames);

      // Set first stock as default
      if (stockNames.length > 0) setSelectedStock(stockNames[0]);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    }
  };

  fetchStocks();
}, []);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Price Chart</Text>
      </View>

      {/* Stock Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedStock}
          onValueChange={(itemValue) => setSelectedStock(itemValue)}
          style={{ width: "100%", height: 50 }}
        >
          {stockOptions.map((stock) => (
            <Picker.Item key={stock} label={stock} value={stock} />
          ))}
        </Picker>
      </View>

      {/* Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{selectedStock} - 6 Months</Text>
        {stocksData[selectedStock] ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={{
                labels: getReducedLabels(stocksData[selectedStock].labels),
                datasets: [
                  {
                    data: stocksData[selectedStock].data,
                    color: (opacity = 1) => `rgba(0, 0, 128, ${opacity})`,
                  },
                ],
                legend: [`${selectedStock} - Price (₦)`],
              }}
              width={stocksData[selectedStock].labels.length * 80}
              height={220}
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

      <Text style={styles.description}>
        This chart displays the historical price data for the selected stock over the last 6 months.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  pickerContainer: {
    width: width - 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 50,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10,
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
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
});
