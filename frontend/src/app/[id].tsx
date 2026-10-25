import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const API_BASE = 'https://your-backend-url.com';

export default function TagScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/patient/${id}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setPatient(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to load patient');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (error) return <ThemedText style={styles.center}>{error}</ThemedText>;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{patient?.name}</ThemedText>
      <ThemedText>Status: {patient?.status}</ThemedText>
      <ThemedText>DOB: {patient?.dob}</ThemedText>
      <ThemedText>Notes: {patient?.notes}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, gap: Spacing.two },
  center: { marginTop: 40, textAlign: 'center' },
});