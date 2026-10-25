import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const SHOW_RED_BOX = false; // set to false once the red circle sits on the Call button

export default function CallScreen() {
  const { width, height } = useWindowDimensions();
  const [callId, setCallId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ringing" | "answered">("idle");

  // Watch our own call so we can show when a CNA answers
  useEffect(() => {
    if (!callId) return;
    const unsub = onSnapshot(doc(db, "calls", callId), (snap) => {
      const data = snap.data();
      if (data?.status) setStatus(data.status);
    });
    return unsub;
  }, [callId]);

  const handleCall = async () => {
    if (status === "ringing") return;
    try {
      const ref = await addDoc(collection(db, "calls"), {
        patientName: "Patient", // TODO: use the real name after login
        room: "Room 12",        // TODO: use the real room
        status: "ringing",
        createdAt: serverTimestamp(),
      });
      setCallId(ref.id);
      setStatus("ringing");
    } catch (e) {
      console.log(e);
      Alert.alert("Couldn't send the call", "Check your internet and try again.");
    }
  };

  return (
    <View style={styles.root}>
      <Image
        source={require("../../assets/images/call.png")}
        style={{ position: "absolute", top: 0, left: 0, width, height }}
        resizeMode="stretch"
      />

      <Pressable
        onPress={handleCall}
        style={[
          styles.callButton,
          SHOW_RED_BOX && { backgroundColor: "rgba(255,0,0,0.35)" },
        ]}
      />

      {status !== "idle" && (
        <Text style={styles.status}>
          {status === "ringing" ? "Calling a CNA..." : "A CNA is on the way"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#aed1bc" },
  callButton: {
    position: "absolute",
    left: "19.2%",
    top: "27.4%",
    width: "61.9%",
    height: "28.5%",
    borderRadius: 999,
  },
  status: {
    position: "absolute",
    top: "85%",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 22,
    color: "#425e4c",
  },
});