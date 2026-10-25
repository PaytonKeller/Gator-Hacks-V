import { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

export default function CNALogin() {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with", staffId, password);
    // call your backend here
  };

  return (
    <ImageBackground
      source={require("../assets/images/login.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Text style={styles.label}>Staff ID</Text>
        <TextInput
          style={styles.input}
          value={staffId}
          onChangeText={setStaffId}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 40 },
  label: { fontSize: 18, color: "#425e4c", marginBottom: 6, marginLeft: 12 },
  input: {
    backgroundColor: "white",
    borderRadius: 30,
    height: 56,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#425e4c",
    borderRadius: 30,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "white", fontSize: 18 },
});