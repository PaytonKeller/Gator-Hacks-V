import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "@/src/config";

const API_BASE = 'https://shrug-snowiness-dispersed.ngrok-free.dev';

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

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  center: { marginTop: 40, textAlign: 'center' },
});