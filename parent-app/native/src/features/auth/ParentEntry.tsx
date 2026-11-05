import React, { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getParentClient } from './client';
import type { EntryScreen } from './entryDecision';
import { palette } from '../../theme';

type Props = {
  screen: EntryScreen;
  onSelect: (screen: 'welcome' | 'login' | 'signup') => void;
  onRefresh: () => Promise<void>;
  onSignOut: () => Promise<void>;
};

export function ParentEntry({ screen, onSelect, onRefresh, onSignOut }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');

  async function submit() {
    if (working) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || password.length < 8) {
      setMessage('Enter a valid email and a password with at least eight characters.');
      return;
    }
    const client = getParentClient();
    if (!client) {
      setMessage('Secure account access is not configured for this preview. Use the existing Bip parent account flow.');
      return;
    }
    setWorking(true);
    setMessage('');
    try {
      if (screen === 'signup') {
        const result = await client.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { account_side: 'parent', signup_source: 'sekret-bip-parent' } },
        });
        if (result.error) throw result.error;
        setPassword('');
        setMessage('Check your email for confirmation. Parent setup and guardian verification must still be completed before entering the app.');
      } else {
        const result = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (result.error) throw result.error;
        setPassword('');
        await onRefresh();
      }
    } catch {
      setMessage('Account action did not complete. Check your details and try again.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient style={styles.background} colors={['#142d25', '#111627', '#0b0e1a']}>
        <View style={styles.card}>
          <Text style={styles.brand}>✦ SE’KRET BIP · PARENT SIDE</Text>
          {screen === 'checking' ? (
            <>
              <ActivityIndicator color={palette.glow} accessibilityLabel="Checking guardian verification" />
              <Text style={styles.description}>Verifying account access…</Text>
            </>
          ) : screen === 'review' ? (
            <>
              <Text style={styles.title}>Your Parent Side stays protected.</Text>
              <Text style={styles.description}>Your account is signed in, but verified guardian access is not complete. Finish your parent setup and guardian review in Se’kret Bip. No app features or teen data are available here yet.</Text>
              <Pressable accessibilityRole="link" onPress={() => {
                void Linking.openURL('https://app.sekretbip.net/parent-setup').catch(() => {
                  setMessage('Unable to open setup. Visit app.sekretbip.net/parent-setup manually.');
                });
              }} style={styles.action}><Text style={styles.actionText}>Complete Parent Setup ↗</Text></Pressable>
              <Text style={styles.description}>After completing setup and verification, return here to check your access. You may need to sign in again.</Text>
              <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>
              <Pressable accessibilityRole="button" onPress={() => { void onRefresh(); }} style={styles.action}><Text style={styles.actionText}>Check verification again ↻</Text></Pressable>
              <Pressable accessibilityRole="button" onPress={() => { void onSignOut(); }} style={styles.secondary}><Text style={styles.secondaryText}>Sign out</Text></Pressable>
            </>
          ) : (
            <>
              <Text style={styles.eyebrow}>A SOFTER WAY TO SHOW UP</Text>
              <Text style={styles.title}>{screen === 'welcome' ? 'You’re here for them.\nThere’s room for you, too.' : screen === 'signup' ? 'Create your Parent account.' : 'Welcome back.'}</Text>
              <Text style={styles.description}>{screen === 'welcome'
                ? 'Your teen’s private world stays theirs. Begin with an account, then verify your guardian status before entering the Parent Side.'
                : 'Your identity is checked with the account server. Parent or guardian access cannot be unlocked by entering a code or choosing a role.'}</Text>
              {screen === 'login' || screen === 'signup' ? (
                <>
                  <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} accessibilityLabel="Account email" placeholder="Email" placeholderTextColor="#aab5b0" style={styles.input} />
                  <TextInput secureTextEntry autoComplete={screen === 'signup' ? 'new-password' : 'current-password'} value={password} onChangeText={setPassword} accessibilityLabel="Account password" placeholder="Password" placeholderTextColor="#aab5b0" style={styles.input} />
                </>
              ) : null}
              <Pressable accessibilityRole="button" disabled={working} style={styles.action} onPress={() => {
                if (screen === 'welcome') { setMessage(''); onSelect('signup'); }
                else { void submit(); }
              }}>
                <Text style={styles.actionText}>{screen === 'welcome' ? 'Create Parent Account ↗' : working ? 'Checking…' : screen === 'signup' ? 'Create Account →' : 'Sign In →'}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => {
                setMessage('');
                onSelect(screen === 'welcome' || screen === 'signup' ? 'login' : 'signup');
              }}>
                <Text style={styles.secondaryText}>{screen === 'welcome' ? 'I already have an account →' : screen === 'signup' ? 'I already have an account' : 'Create Parent Account'}</Text>
              </Pressable>
              {screen !== 'welcome' ? (
                <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => { setMessage(''); onSelect('welcome'); }}>
                  <Text style={styles.secondaryText}>← Back to front door</Text>
                </Pressable>
              ) : null}
              <Text role="alert" style={styles.status}>{message}</Text>
            </>
          )}
          <Text style={styles.footer}>Their private world stays theirs. ♡</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: palette.bg},
  background: {flex: 1, justifyContent: 'center', padding: 24},
  card: {borderRadius: 28, padding: 25, backgroundColor: '#e1ffed16', borderWidth: 1, borderColor: '#c9f7df54'},
  brand: {color: '#c8f7d9', fontWeight: '900', letterSpacing: 1.6, fontSize: 12, marginBottom: 37},
  eyebrow: {color: '#c6d9d0', fontSize: 11, letterSpacing: 1.9, marginBottom: 13},
  title: {color: '#fff', fontFamily: 'serif', fontSize: 35, lineHeight: 44, marginBottom: 22},
  description: {color: '#d0ded7', lineHeight: 24, fontSize: 15, marginBottom: 27},
  input: {backgroundColor: '#0c1a1b', borderColor: '#c1e8d579', borderWidth: 1, borderRadius: 14, color: '#fff', padding: 15, marginBottom: 12},
  action: {backgroundColor: '#bfead1', padding: 17, borderRadius: 18, alignItems: 'center', marginTop: 8},
  actionText: {color: '#092117', fontSize: 15, fontWeight: '800'},
  secondary: {padding: 15, alignItems: 'center'},
  secondaryText: {color: '#d8f2e0', fontWeight: '700', fontSize: 14},
  status: {color: '#e7c4ff', lineHeight: 20, fontSize: 13},
  footer: {color: '#b5d1bf', fontSize: 12, marginTop: 24, textAlign: 'center'},
});
