import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import AsyncStorage from "@react-native-async-storage/async-storage";


const API_BASE = 'https://shrug-snowiness-dispersed.ngrok-free.dev';

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  center: { marginTop: 40, textAlign: 'center' },
});

export default function TagScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!id) return;

  let cancelled = false;

  (async () => {
    try {
      setLoading(true);
      setError("");

      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("You are not logged in. Please log in again.");
      }

      const response = await fetch(
        `${API_BASE}/patient/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? `Request failed (${response.status})`);
      }

      if (!cancelled) {
        setPatient(data);
      }
    } catch (error) {
      if (!cancelled) {
        setError(
          error instanceof Error ? error.message : "Unable to load patient"
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  })();

  return () => {
    cancelled = true;
  };
}, [id]);
  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  if (error) {
    return <ThemedText style={styles.center}>{error}</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{patient?.name}</ThemedText>
      <ThemedText>Status: {patient?.status}</ThemedText>
      <ThemedText>DOB: {patient?.dob}</ThemedText>
      <ThemedText>Notes: {patient?.notes}</ThemedText>

      <ThemedText>
        Latest vitals:{" "}
        {patient?.latest_vitals
          ? `BP ${patient.latest_vitals.blood_pressure}, HR ${patient.latest_vitals.heart_rate}, Temp ${patient.latest_vitals.temperature}, O₂ ${patient.latest_vitals.oxygen_sat}`
          : "None recorded"}
      </ThemedText>
    </ThemedView>
  );
}
