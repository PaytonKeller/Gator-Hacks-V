import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

// ---- Adjust these numbers to line up the tap areas ----
const SHOW_RED_BOXES = false; // set to false when everything lines up
const PATIENT_TOP = 41.2;    // % from the top of the screen
const CNA_TOP = 54.9;        // % from the top of the screen
const BOX_LEFT = 11.4;       // % from the left edge
const BOX_WIDTH = 76.1;      // % of the screen width
const BOX_HEIGHT = 7.7;      // % of the screen height
// --------------------------------------------------------

export default function Welcome() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const tapStyle = (top: number) => ({
    position: "absolute" as const,
    top: `${top}%` as `${number}%`,
    left: `${BOX_LEFT}%` as `${number}%`,
    width: `${BOX_WIDTH}%` as `${number}%`,
    height: `${BOX_HEIGHT}%` as `${number}%`,
    backgroundColor: SHOW_RED_BOXES ? "rgba(255,0,0,0.35)" : "transparent",
  });

  return (
    <View style={styles.root}>
      <Image
        source={require("../../assets/images/home.png")}
        style={{ position: "absolute", top: 0, left: 0, width, height }}
        resizeMode="stretch"
      />

      <Pressable
        style={tapStyle(PATIENT_TOP)}
        onPress={() => router.push({ pathname: "/login", params: { role: "patient" } })}
      />

      <Pressable
        style={tapStyle(CNA_TOP)}
        onPress={() => router.push({ pathname: "/login", params: { role: "cna" } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#aed1bc" },
});