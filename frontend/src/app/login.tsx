import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const API_BASE = "https://shrug-snowiness-dispersed.ngrok-free.dev";
export default function Login() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, (e) =>
      setShift(-e.endCoordinates.height * 0.6)
    );
    const hide = Keyboard.addListener(hideEvent, () => setShift(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

 import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "@/src/config";

// Inside Login():

const [submitting, setSubmitting] = useState(false);

const handleLogin = async () => {
  const id = staffId.trim();

  if (!id || !password) {
    Alert.alert("Missing info", "Please enter your ID and password.");
    return;
  }

  setSubmitting(true);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? `Login failed (${res.status})`);
    }

    await AsyncStorage.multiSet([
      ["access_token", data.access_token],
      ["refresh_token", data.refresh_token],
      ["nurse", JSON.stringify(data.nurse)],
    ]);

    router.replace("/patient");
  } catch (e) {
    Alert.alert(
      "Login failed",
      e instanceof Error ? e.message : "Could not connect to the server."
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <View style={styles.root}>
      <View style={[styles.screen, { transform: [{ translateY: shift }] }]}>
        <Image
          source={require("../../assets/images/login.png")}
          style={{ position: "absolute", top: 0, left: 0, width, height }}
          resizeMode="stretch"
        />

        <TextInput
          style={[styles.input, { top: "52.8%" }]}
          value={staffId}
          onChangeText={setStaffId}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={[styles.input, { top: "64.9%" }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={submitting}
        >
        <Text style={styles.buttonText}>
          {submitting ? "Logging in…" : "Log in"}
        </Text>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#aed1bc" },
  screen: { flex: 1 },
  input: {
    position: "absolute",
    left: "11.9%",
    width: "76.1%",
    height: "7.7%",
    paddingHorizontal: 24,
    fontSize: 20,
    color: "#2f4a3a",
    backgroundColor: "transparent",
  },
  button: {
    position: "absolute",
    top: "76%",
    left: "25%",
    width: "50%",
    height: "5.5%",
    backgroundColor: "#425e4c",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 18 },
  patientBox: {
  position: "absolute",
  top: "76%",
  left: "25%",
  width: "50%",
  height: "5.5%",
  backgroundColor: "rgba(255,0,0,0.35)", // temporary: shows the box
},
});