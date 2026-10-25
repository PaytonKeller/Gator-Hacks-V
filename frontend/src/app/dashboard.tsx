import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  Vibration,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

// Set to false once the red box sits exactly on the Patients pill
const SHOW_RED_BOXES = false;

type Call = { id: string; patientName: string; room: string };

export default function Dashboard() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [calls, setCalls] = useState<Call[]>([]);

  // Listen for any call that is still ringing
  useEffect(() => {
    const q = query(collection(db, "calls"), where("status", "==", "ringing"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Call[];
      setCalls(list);
      if (snap.docChanges().some((c) => c.type === "added")) {
        Vibration.vibrate([0, 500, 300, 500]);
      }
    });
    return unsub;
  }, []);

  const answer = async (id: string) => {
    await updateDoc(doc(db, "calls", id), { status: "answered" });
  };

  const current = calls[0];

  return (
    <View style={styles.root}>
      <Image
        source={require("../../assets/images/dashboard.png")}
        style={{ position: "absolute", top: 0, left: 0, width, height }}
        resizeMode="stretch"
      />

      {/* Tap area over the "Patients" pill */}
      <Pressable
        style={[styles.patientsTap, SHOW_RED_BOXES && styles.redBox]}
        onPress={() => router.push("/patient" as any)}
      />

      {current && (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>🔔 {current.patientName} needs help</Text>
          <Text style={styles.bannerSub}>
            {current.room}
            {calls.length > 1 ? `  (+${calls.length - 1} more waiting)` : ""}
          </Text>
          <Pressable style={styles.answerButton} onPress={() => answer(current.id)}>
            <Text style={styles.answerText}>Answer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#aed1bc" },
  patientsTap: {
    position: "absolute",
    top: "57.2%",
    left: "9.7%",
    width: "81.3%",
    height: "7.7%",
    borderRadius: 999,
  },
  redBox: { backgroundColor: "rgba(255,0,0,0.35)" },
  banner: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#425e4c",
    borderRadius: 24,
    padding: 16,
  },
  bannerTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },
  bannerSub: { color: "#dff5e8", fontSize: 16, marginTop: 4, marginBottom: 12 },
  answerButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  answerText: { color: "#425e4c", fontSize: 18, fontWeight: "600" },
});