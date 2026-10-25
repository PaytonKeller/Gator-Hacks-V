import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function Login() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
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

  const handleLogin = () => {
    if (!staffId || !password) {
      Alert.alert("Missing info", "Please enter your ID and password.");
      return;
    }
    // Patients go to the Call screen, CNAs go to the Dashboard
    router.replace((role === "patient" ? "/call" : "/dashboard") as any);
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

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>
      </View>
    </View>
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
});