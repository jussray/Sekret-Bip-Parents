import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Tabs } from 'expo-router';
import { AppState, Pressable, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getParentClient } from '../src/features/auth/client';
import { ParentEntry } from '../src/features/auth/ParentEntry';
import { verifyCurrentGuardian, type GuardianDecision } from '../src/features/auth/guardianEvidence';
import { resolveEntryScreen } from '../src/features/auth/entryDecision';
import { palette } from '../src/theme';

function Icon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function ParentLayout() {
  // Null means no route access during the authoritative server check.
  const [decision, setDecision] = useState<GuardianDecision | null>(null);
  const [requested, setRequested] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    setDecision(null);
    const client = getParentClient();
    const result: GuardianDecision = client
      ? await verifyCurrentGuardian(client)
      : { kind: 'visitor' };
    if (request === generation.current) setDecision(result);
  }, []);
  const signOut = useCallback(async () => {
    ++generation.current; // revoke local render authority immediately
    setDecision({ kind: 'visitor' });
    setRequested('welcome');
    await getParentClient()?.auth.signOut().catch(() => null);
  }, []);

  useEffect(() => {
    void refresh();
    const client = getParentClient();
    const { data: { subscription } } = client?.auth.onAuthStateChange((event) => {
      // Clearing the gate is synchronous, so old tabs cannot linger on signout.
      if (event === 'SIGNED_OUT') {
        ++generation.current;
        setDecision({ kind: 'visitor' });
        setRequested('welcome');
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        // Defer remote reads outside Supabase's auth callback to avoid deadlocks.
        Promise.resolve().then(() => { void refresh(); });
      }
    }) ?? { data: { subscription: null } };
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void refresh(); // all grants and guardian verification may have changed
      } else {
        ++generation.current;
        setDecision(null); // hide all tabs immediately on background
      }
    });
    return () => {
      ++generation.current;
      appState.remove();
      subscription?.unsubscribe();
    };
  }, [refresh]);

  if (resolveEntryScreen(decision, requested) !== 'app') {
    return (
      <ParentEntry
        screen={resolveEntryScreen(decision, requested)}
        onSelect={setRequested}
        onRefresh={refresh}
        onSignOut={signOut}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <Tabs screenOptions={{
        headerShown: true,
        headerTitle: 'Se’kret Bip Parents',
        headerStyle: { backgroundColor: palette.bg },
        headerTintColor: palette.text,
        headerRight: () => (
          <Pressable accessibilityRole="button" accessibilityLabel="Sign out" onPress={() => { void signOut(); }} style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: palette.glow, fontWeight: '800' }}>Sign out</Text>
          </Pressable>
        ),
        tabBarActiveTintColor: palette.glow,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: { backgroundColor: palette.bg, borderTopColor: palette.border, height: 70, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
        <Tabs.Screen name="index" options={{ title: 'Room', tabBarIcon: () => <Icon emoji="🏡" /> }} />
        <Tabs.Screen name="pages" options={{ title: 'Pages', tabBarIcon: () => <Icon emoji="📝" /> }} />
        <Tabs.Screen name="coach" options={{ title: 'Coach', tabBarIcon: () => <Icon emoji="✨" /> }} />
        <Tabs.Screen name="bridge" options={{ title: 'Bridge', tabBarIcon: () => <Icon emoji="🌉" /> }} />
        <Tabs.Screen name="circle" options={{ title: 'Circle', tabBarIcon: () => <Icon emoji="🤝" /> }} />
      </Tabs>
    </SafeAreaProvider>
  );
}
