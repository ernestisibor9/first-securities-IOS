import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions(); // ✅ auto updates on rotation

  return (
    <SafeAreaView style={styles(width, height).container}>
      {/* Transparent Light Status Bar */}
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0, 43, 91, 0.8)"
      />

        {/* Logo */}
        <View style={{ marginTop: -10, marginBottom: 10 }}>
          <Image
            source={require("../assets/images/fslogo.png")}
            style={{ width: 180, height: 130 }}
          />
        </View>

      {/* Bull Image */}
      <Image
        source={require("../assets/images/bull-chart.jpg")}
        style={styles(width, height).mainImage}
        resizeMode="contain"
      />

      {/* Main Text */}
      <Text style={styles(width, height).heading}>
        Invest Smarter. Grow Your Wealth.
      </Text>
      <Text style={styles(width, height).subHeading}>
        Your trusted partner for navigating the stock market.
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles(width, height).button}
        onPress={() => router.push("/marketinsight")}
      >
        <Text style={styles(width, height).buttonText}>MARKET INSIGHT</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(width, height).button}
        onPress={() => router.push("/dailypricelist")}
      >
        <Text style={styles(width, height).buttonText}>DAILY PRICE LIST</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles(width, height).button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles(width, height).buttonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* Sign up link */}
      <View style={styles(width, height).signupContainer}>
        <Text style={styles(width, height).signupText}>
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles(width, height).signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom links */}
      <View style={styles(width, height).bottomLinks}>
        <TouchableOpacity onPress={() => router.push("/pricechart")}>
          <Text style={styles(width, height).bottomLinkText}>Price Chart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/pricealert")}>
          <Text style={styles(width, height).bottomLinkText}>Price Alert</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center", // ✅ centers vertically when content is small
      paddingVertical: 20,
    },
    logo: {
      width: width * 0.25,
      height: width * 0.18,
      maxWidth: 100,
      maxHeight: 80,
      marginBottom: 10,
    },
    title: {
      fontSize: width * 0.05,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    mainImage: {
      width: "90%",
      maxWidth: 350,
      maxHeight: height * 0.3,
      borderRadius: 10,
      marginBottom: 20,
      alignSelf: "center",
    },
    heading: {
      fontSize: width * 0.045,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    subHeading: {
      fontSize: width * 0.04,
      textAlign: "center",
      color: "#555",
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    button: {
      backgroundColor: "#002B5B",
      paddingVertical: 12,
      borderRadius: 8,
      marginVertical: 8,
      width: "80%",
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: width * 0.045,
    },
    signupContainer: {
      flexDirection: "row",
      marginTop: 20,
      marginBottom: 10,
    },
    signupText: {
      color: "#444",
      fontSize: width * 0.038,
    },
    signupLink: {
      color: "#002B5B",
      fontWeight: "600",
      fontSize: width * 0.038,
    },
    bottomLinks: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "80%",
      marginTop: 10,
    },
    bottomLinkText: {
      color: "#002B5B",
      fontWeight: "600",
      fontSize: width * 0.038,
    },
  });
