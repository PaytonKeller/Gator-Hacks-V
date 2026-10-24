import { View, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import { colors, spacing, radius } from '../constants/design';

export default function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});