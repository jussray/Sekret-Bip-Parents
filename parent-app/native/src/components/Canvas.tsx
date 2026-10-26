import React, { type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../theme';

type Props = { eyebrow: string; title: string; detail?: string; children: ReactNode };
export function Canvas({ eyebrow, title, detail, children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={['#25153f', '#12102b', '#090817']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.brand}>✦ SE’KRET BIP <Text style={styles.brandSuffix}>PARENT SIDE</Text></Text>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          {detail ? <Text style={styles.detail}>{detail}</Text> : null}
          {children}
          <Text style={styles.footer}>Connection without control. ♡</Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
export function Glass({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.glass, style]}>{children}</View>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  gradient: { flex: 1 },
  content: { paddingTop: 32, paddingBottom: 66, paddingHorizontal: 22, flexGrow: 1 },
  brand: { fontSize: 12, letterSpacing: 1.9, color: palette.glow, fontWeight: '900', marginBottom: 48 },
  brandSuffix: { fontSize: 9, letterSpacing: 1.3, color: '#c8a9d4' },
  eyebrow: { fontSize: 11, color: palette.glow, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '800', marginBottom: 16 },
  title: { fontSize: 36, lineHeight: 42, fontFamily: 'serif', color: palette.text, marginBottom: 17 },
  detail: { fontSize: 16, lineHeight: 25, color: palette.muted, marginBottom: 25 },
  glass: { backgroundColor: 'rgba(178,141,217,0.14)', borderColor: 'rgba(235,205,255,0.28)', borderWidth: 1, borderRadius: 22, padding: 20, marginBottom: 18 },
  footer: { color: '#a69bb8', fontSize: 12, textAlign: 'center', marginTop: 34, letterSpacing: 0.6 },
});
