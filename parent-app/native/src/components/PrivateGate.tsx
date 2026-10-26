import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Glass } from './Canvas';
import { resolvePrivateParentFeature, type PrivateParentFeature } from '../features/connection/privateGate';
import { palette } from '../theme';

export function PrivateGate({ feature }: { feature: PrivateParentFeature }) {
  const result = resolvePrivateParentFeature(feature);
  return (
    <Glass>
      <Text style={styles.lock}>🔒 Private connection is locked</Text>
      <Text style={styles.message}>{result.reason}</Text>
      <Text style={styles.message}>No child-specific data is loaded on this screen. Connecting an account must not grant blanket access to a teen’s private content.</Text>
    </Glass>
  );
}
const styles = StyleSheet.create({
  lock: { fontSize: 21, color: palette.text, fontWeight: '800', marginBottom: 15 },
  message: { fontSize: 15, color: palette.muted, lineHeight: 24, marginBottom: 10 },
});
