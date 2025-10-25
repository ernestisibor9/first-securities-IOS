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
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as ScreenOrientation from "expo-screen-orientation";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CACHE_KEY = "market_insights_v1";
const API_URL = "https://regencyng.net/fs-api/proxy.php?type=market";

export default function MarketInsight() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";
  const { width, height } = useWindowDimensions();

  // Responsive scaling helpers
  const scaleFont = (size) => Math.max(12, Math.min(size * (width / 375), 22));
  const scalePadding = (value) => value * (width / 375);

  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Enable dynamic rotation and listen for orientation changes
  useEffect(() => {
    ScreenOrientation.unlockAsync();

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
       // console.log("Orientation changed:", event.orientationInfo.orientation);
      }
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (mounted && cached) setInsights(JSON.parse(cached));
      } catch (e) {
      } finally {
        fetchInsights();
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchInsights = useCallback(async () => {
    setError(null);
    if (!refreshing) setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(arr));
      setInsights(arr);
    } catch (err) {
      setError("Failed to load market insights. Pull to retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInsights();
  }, [fetchInsights]);

  const openLink = async (url) => {
    Haptics.selectionAsync();
    try {
      const s = String(url || "");
      if (!s) return;
      const can = await Linking.canOpenURL(s);
      can ? Linking.openURL(s) : Alert.alert("Unable to open link");
    } catch {
      Alert.alert("Unable to open link");
    }
  };

  const onShare = async (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const message = `${item.title || ""}\n\n${item.url || ""}`;
      await Share.share({ message });
    } catch {}
  };

  const renderItem = ({ item }) => {
    const short =
      item.content?.length > 140
        ? item.content.slice(0, 140) + "..."
        : item.content;

    return (
      <View
        style={[
          styles.card,
          dark && styles.cardDark,
          { padding: scalePadding(14), borderRadius: scalePadding(10) },
        ]}
      >
        <Text
          style={[
            styles.title,
            dark && styles.titleDark,
            { fontSize: scaleFont(16) },
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.desc,
            dark && styles.descDark,
            { fontSize: scaleFont(14) },
          ]}
        >
          {short}
        </Text>

        <View style={styles.row}>
          {item.url ? (
            <TouchableOpacity
              onPress={() => openLink(item.url)}
              style={styles.linkWrap}
            >
              <Feather
                name="external-link"
                size={scaleFont(14)}
                color={dark ? "#8fbfff" : "#1E90FF"}
              />
              <Text
                style={[
                  styles.link,
                  dark && styles.linkDark,
                  { fontSize: scaleFont(12) },
                ]}
                numberOfLines={1}
              >
                {String(item.url)}
              </Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.actionRow}>
            <Text
              style={[
                styles.time,
                dark && styles.timeDark,
                { fontSize: scaleFont(12) },
              ]}
            >
              {item.date}
            </Text>
            <TouchableOpacity
              onPress={() => onShare(item)}
              style={styles.shareBtn}
            >
              <Feather name="share-2" size={scaleFont(14)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading && insights.length === 0) {
    return (
      <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#002B5B" />
          <Text
            style={[
              styles.loadingText,
              dark && styles.loadingTextDark,
              { fontSize: scaleFont(14) },
            ]}
          >
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
            size={scaleFont(18)}
            color={dark ? "#fff" : "#002B5B"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.header,
            dark && styles.headerDark,
            { fontSize: scaleFont(18) },
          ]}
        >
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
            size={scaleFont(16)}
            color={dark ? "#fff" : "#002B5B"}
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <TouchableOpacity style={styles.errorBanner} onPress={fetchInsights}>
          <Text style={[styles.errorText, { fontSize: scaleFont(13) }]}>
            {error} • Tap to retry
          </Text>
        </TouchableOpacity>
      ) : null}

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
            <Text
              style={[
                styles.emptyText,
                dark && styles.emptyTextDark,
                { fontSize: scaleFont(14) },
              ]}
            >
              No market insights available.
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchInsights}>
              <Text style={[styles.retryText, { fontSize: scaleFont(14) }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}
        initialNumToRender={8}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  containerDark: { backgroundColor: "#0b1220" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#555" },
  loadingTextDark: { color: "#ccc" },
  headerContainer: {
    paddingHorizontal: 16,
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
  header: { fontWeight: "700", color: "#002B5B" },
  headerDark: { color: "#fff" },
  listContent: { padding: 16, paddingBottom: 24 },
  card: { backgroundColor: "#F5F7FA", marginBottom: 12 },
  cardDark: { backgroundColor: "#081623" },
  title: { fontWeight: "700", marginBottom: 6, color: "#071428" },
  titleDark: { color: "#e6f0ff" },
  desc: { marginBottom: 10, color: "#444" },
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
  link: { marginLeft: 6, flexShrink: 1 },
  linkDark: { color: "#8fbfff" },
  actionRow: { flexDirection: "row", alignItems: "center" },
  time: { marginRight: 10, color: "#999" },
  timeDark: { color: "#9fb4d6" },
  shareBtn: { backgroundColor: "#004AAD", padding: 6, borderRadius: 6 },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyBox: { alignItems: "center" },
  emptyText: { color: "#555", marginBottom: 12 },
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
