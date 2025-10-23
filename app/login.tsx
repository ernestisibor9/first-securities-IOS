import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions(); // ✅ Automatically updates on rotation
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation | null>(null);

  // 🔁 Track orientation in real time
  useEffect(() => {
    const setInitialOrientation = async () => {
      const current = await ScreenOrientation.getOrientationAsync();
      setOrientation(current);
    };
    setInitialOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener((evt) =>
      setOrientation(evt.orientationInfo.orientation)
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Determine landscape or portrait
  const isLandscape =
    orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  // 🌐 Open Dashboard URL
  const openDashboard = async () => {
    const url = "https://myportfolio.fbnquest.com/Securities";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Unable to open the dashboard URL.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        {/* Arrow Button */}
        <TouchableOpacity
          onPress={openDashboard}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>

        {/* Dashboard Label */}
        <TouchableOpacity onPress={openDashboard}>
          <Text
            style={[
              styles.headerTitle,
              { fontSize: isLandscape ? 18 : 16 },
              { maxWidth: width * 0.8 }, // Responsive text scaling
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🌍 WebView */}
      <WebView
        key={orientation} // ✅ Forces re-render when rotating
        style={{
          flex: 1,
          width,
          height,
          backgroundColor: "#fff",
        }}
        source={{
          uri: "https://alabiansolutions.com/client-mobile-app/redirect.php",
        }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#002B5B" />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess={false}
        allowUniversalAccessFromFileURLs={false}
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
        originWhitelist={["https://*"]}
        setWebContentsDebuggingEnabled={false}
      />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  iconButton: {
    padding: 6,
  },
  headerTitle: {
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
