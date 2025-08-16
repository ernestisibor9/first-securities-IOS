import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";


const index = () => {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Transparent Light Status Bar */}
      {/* <StatusBar barStyle="light-content" translucent backgroundColor="transparent" /> */}
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0, 43, 91, 0.8)"
      />

      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>First Securities</Text>

      {/* Bull Image */}
      <Image
        source={require("../assets/images/bull-chart.jpg")}
        style={styles.mainImage}
        resizeMode="cover"
      />

      {/* Main Text */}
      <Text style={styles.heading}>Invest Smarter. Grow Your Wealth.</Text>
      <Text style={styles.subHeading}>
        Your trusted partner for navigating the stock market.
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/marketinsight")}
      >
        <Text style={styles.buttonText}>MARKET INSIGHT</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/dailypricelist")}
      >
        <Text style={styles.buttonText}>DAILY PRICE LIST</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("https://myportfolio.fbnquest.com/Securities/Home/Login")}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* Sign up link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("https://myportfolio.fbnquest.com/Securities/NewAccount/Registration")}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom links */}
      <View style={styles.bottomLinks}>
        <TouchableOpacity onPress={() => router.push("/pricechart")}>
          <Text style={styles.bottomLinkText}>Price Chart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/pricealert")}>
          <Text style={styles.bottomLinkText}>Price Alert</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  logo: {
    width: 80,
    height: 60,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  mainImage: {
    width: 310,
    height: 190,
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#002B5B",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  signupText: {
    color: "#444",
  },
  signupLink: {
    color: "#002B5B",
    fontWeight: "600",
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
  },
});
