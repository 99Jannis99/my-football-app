import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require("../assets/animations/football.json")}
          style={styles.animation}
          autoPlay
          loop
        />
      </View>
      <Text style={styles.title}>Willkommen bei Football Stats</Text>
      <Text style={styles.subtitle}>
        Entdecken Sie die neuesten Statistiken und Informationen zu Ihrer Lieblingsliga
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  animationContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
    marginBottom: 30,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#cccccc",
    textAlign: "center",
    lineHeight: 24,
  },
});
