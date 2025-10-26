import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";

const Index = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [orientation, setOrientation] = useState("PORTRAIT");

  // ✅ Detect and respond to orientation changes dynamically
  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        const o = event.orientationInfo.orientation;
        if (
          o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
        ) {
          setOrientation("LANDSCAPE");
        } else {
          setOrientation("PORTRAIT");
        }
      }
    );

    ScreenOrientation.unlockAsync(); // Allow auto-rotation on iOS and Android

    return () =>
      ScreenOrientation.removeOrientationChangeListener(subscription);
  }, []);

  const isLandscape = orientation === "LANDSCAPE";
  const s = styles(width, height, isLandscape);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0, 43, 91, 0.8)"
      />

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.container}>
          {/* Left Side (Logo + Image) */}
          <View style={s.imageContainer}>
            <Image
              source={require("../assets/images/fslogo.png")}
              style={s.logo}
              resizeMode="contain"
            />
            <Image
              source={require("../assets/images/bull-chart.jpg")}
              style={s.mainImage}
              resizeMode="contain"
            />
          </View>

          {/* Right Side (Text + Buttons) */}
          <View style={s.textContainer}>
            <Text style={s.heading}>Invest Smarter. Grow Your Wealth.</Text>
            <Text style={s.subHeading}>
              Your trusted partner for navigating the stock market.
            </Text>

            <TouchableOpacity
              style={s.button}
              onPress={() => router.push("/marketinsight")}
            >
              <Text style={s.buttonText}>MARKET INSIGHT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.button}
              onPress={() => router.push("/dailypricelist")}
            >
              <Text style={s.buttonText}>DAILY PRICE LIST</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.button}
              onPress={() => router.push("/login")}
            >
              <Text style={s.buttonText}>LOGIN</Text>
            </TouchableOpacity>

            <View style={s.signupContainer}>
              <Text style={s.signupText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={s.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <View style={s.bottomLinks}>
              <TouchableOpacity onPress={() => router.push("/pricechart")}>
                <Text style={s.bottomLinkText}>Price Chart</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/pricealert")}>
                <Text style={s.bottomLinkText}>Price Alert</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.footerNote}>
              First Securities is registered as a broker dealer{"\n"}
              and regulated by the Securities and Exchange{"\n"}
              Commission, Nigeria.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

const styles = (width: number, height: number, isLandscape: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      flexDirection: isLandscape ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: isLandscape ? 40 : 20,
      width: "100%",
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: isLandscape ? 0 : 20,
      marginRight: isLandscape ? 20 : 0,
      width: isLandscape ? "45%" : "100%",
    },
    textContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: isLandscape ? "50%" : "100%",
    },
    logo: {
      width: isLandscape ? 140 : 180,
      height: isLandscape ? 100 : 130,
      marginBottom: 10,
    },
    mainImage: {
      width: isLandscape ? width * 0.4 : width * 0.9,
      height: isLandscape ? height * 0.5 : height * 0.3,
      borderRadius: 10,
    },
    heading: {
      fontSize: width * 0.045,
      fontWeight: "700",
      textAlign: "center",
      color: "#002B5B",
      marginBottom: 10,
    },
    subHeading: {
      fontSize: width * 0.04,
      textAlign: "center",
      color: "#444",
      marginBottom: 25,
      paddingHorizontal: 20,
    },
    button: {
      backgroundColor: "#002B5B",
      paddingVertical: 12,
      borderRadius: 10,
      marginVertical: 8,
      width: "85%",
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: width * 0.042,
    },
    signupContainer: {
      flexDirection: "row",
      marginTop: 20,
      marginBottom: 10,
    },
    signupText: {
      color: "#555",
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
      marginTop: 15,
    },
    bottomLinkText: {
      color: "#002B5B",
      fontWeight: "600",
      fontSize: width * 0.038,
    },
    footerNote: {
      textAlign: "center",
      color: "#777",
      fontSize: width * 0.032,
      marginTop: 25,
      marginBottom: 20,
      lineHeight: 20,
      paddingHorizontal: 25,
    },
  });
