// MarketInsight.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  RefreshControl,
  Share,
  useColorScheme,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CACHE_KEY = "market_insights_v1";
const API_URL = "https://regencyng.net/fs-api/proxy.php?type=market";

export default function MarketInsight() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";

  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true); // initial spinner
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Load cached data (if any), then fetch fresh
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (mounted && cached) {
          setInsights(JSON.parse(cached));
        }
      } catch (e) {
        console.warn("Failed to read cached insights:", e);
      } finally {
        // fetch fresh data (don't await here to show cache quickly)
        fetchInsights();
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch function (shared by refresh and initial load)
  const fetchInsights = useCallback(async () => {
    setError(null);
    if (!refreshing) setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();

      // Normalize to array
      const arr = Array.isArray(data) ? data : [];

      // Save cache
      try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(arr));
      } catch (e) {
        console.warn("Failed to write cache:", e);
      }

      setInsights(arr);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Failed to load market insights. Pull to retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInsights();
  }, [fetchInsights]);

  // Open link safely and give haptic feedback
  const openLink = async (url) => {
    Haptics.selectionAsync();
    try {
      const s = String(url || "");
      if (!s) return;
      const can = await Linking.canOpenURL(s);
      if (can) {
        Linking.openURL(s);
      } else {
        Alert.alert("Unable to open link");
      }
    } catch (err) {
      console.warn("Error opening link:", err);
      Alert.alert("Unable to open link");
    }
  };

  // Native share
  const onShare = async (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const message = `${item.title || ""}\n\n${item.url || ""}`;
      await Share.share({ message });
    } catch (err) {
      console.warn("Share error:", err);
    }
  };

  const renderItem = ({ item, index }) => {
    const title = String(item.title || "");
    const content = String(item.content || "");
    const short =
      content.length > 140 ? content.slice(0, 140) + "..." : content;
    const date = String(item.date || "");

    return (
      <View style={[styles.card, dark && styles.cardDark]}>
        <Text style={[styles.title, dark && styles.titleDark]}>{title}</Text>
        <Text style={[styles.desc, dark && styles.descDark]}>{short}</Text>

        <View style={styles.row}>
          {item.url ? (
            <TouchableOpacity
              onPress={() => openLink(item.url)}
              style={styles.linkWrap}
            >
              <Feather
                name="external-link"
                size={16}
                color={dark ? "#8fbfff" : "#1E90FF"}
              />
              <Text
                style={[styles.link, dark && styles.linkDark]}
                numberOfLines={1}
              >
                {String(item.url)}
              </Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.actionRow}>
            <Text style={[styles.time, dark && styles.timeDark]}>{date}</Text>

            <TouchableOpacity
              onPress={() => onShare(item)}
              style={styles.shareBtn}
            >
              <Feather
                name="share-2"
                size={16}
                color={dark ? "#fff" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading && insights.length === 0) {
    // initial loading spinner (no cache)
    return (
      <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#002B5B" />
          <Text style={[styles.loadingText, dark && styles.loadingTextDark]}>
            Loading Market Insights...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
      {/* Header */}
      <View
        style={[styles.headerContainer, dark && styles.headerContainerDark]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather
            name="arrow-left"
            size={24}
            color={dark ? "#fff" : "#002B5B"}
          />
        </TouchableOpacity>
        <Text style={[styles.header, dark && styles.headerDark]}>
          Market Insight
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            fetchInsights();
          }}
        >
          <Feather
            name="refresh-ccw"
            size={20}
            color={dark ? "#fff" : "#002B5B"}
          />
        </TouchableOpacity>
      </View>

      {/* Error banner */}
      {error ? (
        <TouchableOpacity style={[styles.errorBanner]} onPress={fetchInsights}>
          <Text style={styles.errorText}>{error} • Tap to retry</Text>
        </TouchableOpacity>
      ) : null}

      {/* List */}
      <FlatList
        data={insights}
        keyExtractor={(item, idx) => (item.id ? String(item.id) : String(idx))}
        renderItem={renderItem}
        contentContainerStyle={
          insights.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, dark && styles.emptyTextDark]}>
              No market insights available.
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchInsights}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        // subtle optimization props
        initialNumToRender={8}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const basePadding = 16;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  containerDark: { backgroundColor: "#0b1220" },

  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
  loadingTextDark: { color: "#ccc" },

  headerContainer: {
    paddingHorizontal: basePadding,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 10,
    backgroundColor: "#fff",
  },
  headerContainerDark: {
    borderBottomColor: "#16202b",
    backgroundColor: "#071020",
  },
  header: { fontSize: 18, fontWeight: "700", color: "#002B5B" },
  headerDark: { color: "#fff" },

  listContent: { padding: basePadding, paddingBottom: 24 },
  card: {
    backgroundColor: "#F5F7FA",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardDark: { backgroundColor: "#081623" },

  title: { fontWeight: "700", fontSize: 16, marginBottom: 6, color: "#071428" },
  titleDark: { color: "#e6f0ff" },

  desc: { fontSize: 14, marginBottom: 10, color: "#444" },
  descDark: { color: "#cfd9e6" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  link: { marginLeft: 6, fontSize: 12, color: "#1E90FF", flexShrink: 1 },
  linkDark: { color: "#8fbfff" },

  actionRow: { flexDirection: "row", alignItems: "center" },
  time: { fontSize: 12, color: "#999", marginRight: 10 },
  timeDark: { color: "#9fb4d6" },

  shareBtn: {
    backgroundColor: "#004AAD",
    padding: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: basePadding,
  },
  emptyBox: { alignItems: "center" },
  emptyText: { color: "#555", fontSize: 14, marginBottom: 12 },
  emptyTextDark: { color: "#ccc" },

  retryBtn: {
    backgroundColor: "#002B5B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },

  errorBanner: {
    backgroundColor: "#fff4f4",
    padding: 10,
    alignItems: "center",
  },
  errorText: { color: "#b00020" },
});
