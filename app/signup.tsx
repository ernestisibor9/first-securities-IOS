import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const { width } = useWindowDimensions();
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation | null>(null);
  const [currentUrl, setCurrentUrl] = useState(
    "https://alabiansolutions.com/client-mobile-app/fs-signup.php"
  );
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ spinner control
  const router = useRouter();

  // 🔁 Handle orientation
  useEffect(() => {
    const setupOrientation = async () => {
      await ScreenOrientation.unlockAsync();
      const current = await ScreenOrientation.getOrientationAsync();
      setOrientation(current);
    };
    setupOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener((evt) =>
      setOrientation(evt.orientationInfo.orientation)
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const isLandscape =
    orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  // 🔙 Back Button (Home) with spinner
  const handleGoBack = () => {
    setLoading(true); // show spinner
    setTimeout(() => {
      if (webViewRef.current && canGoBack) {
        webViewRef.current.goBack();
      } else {
        router.back();
      }
      setLoading(false);
    }, 1200); // delay for spinner
  };

  // 🌐 Dashboard button with spinner
  const goToDashboard = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentUrl("https://myportfolio.fbnquest.com/Securities");
      setLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* 🔹 Header */}
      <View
        style={[
          styles.header,
          {
            paddingVertical: isLandscape ? 6 : 12,
            paddingHorizontal: isLandscape ? 20 : 12,
          },
        ]}
      >
        {/* ⬅️ Home */}
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.homeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={22} color="#002B5B" />
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>

        {/* 🧭 Dashboard */}
        <TouchableOpacity onPress={goToDashboard} style={styles.dashboardButton}>
          <Text style={[styles.headerTitle, { fontSize: isLandscape ? 18 : 16 }]}>
            Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🌍 WebView */}
      <View style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          key={orientation}
          style={styles.webview}
          source={{ uri: currentUrl }}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#002B5B" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          allowsBackForwardNavigationGestures
          originWhitelist={["https://*"]}
          automaticallyAdjustContentInsets
          mixedContentMode="never"
          allowsLinkPreview={Platform.OS === "ios"}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          setWebContentsDebuggingEnabled={false}
        />

        {/* 🔹 Global loader overlay */}
        {loading && (
          <View style={styles.globalLoader}>
            <ActivityIndicator size="large" color="#002B5B" />
            <Text style={styles.loadingText}>Please wait...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  homeButton: { flexDirection: "row", alignItems: "center", padding: 6 },
  homeText: { marginLeft: 6, fontSize: 16, fontWeight: "600", color: "#002B5B" },
  dashboardButton: { padding: 6 },
  headerTitle: { fontWeight: "600", color: "#002B5B" },
  webview: { flex: 1, width: "100%", height: "100%", backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#002B5B", fontWeight: "500" },
  globalLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});
