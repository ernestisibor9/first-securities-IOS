import React, { useEffect, useState } from "react";
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

export default function SignupScreen() {
  const { width, height } = useWindowDimensions();
  const [currentUrl, setCurrentUrl] = useState(
    "https://alabiansolutions.com/client-mobile-app/fs-signup.php"
  );

  // ✅ Automatically allow rotation
  useEffect(() => {
    const enableRotation = async () => {
      await ScreenOrientation.unlockAsync();
    };
    enableRotation();

    const subscription = ScreenOrientation.addOrientationChangeListener(() => {});
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // ✅ Function to redirect to dashboard URL
  const goToDashboard = () => {
    setCurrentUrl("https://myportfolio.fbnquest.com/Securities");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToDashboard}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToDashboard}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* WebView with Centered Loader */}
      <View style={{ flex: 1 }}>
        <WebView
          style={styles.webview}
          source={{ uri: currentUrl }}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10,
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#002B5B",
    fontWeight: "500",
  },
});
