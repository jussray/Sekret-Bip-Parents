import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { palette } from '../src/theme';

function Icon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function ParentLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.glow,
          tabBarInactiveTintColor: palette.muted,
          tabBarStyle: { backgroundColor: palette.bg, borderTopColor: palette.border, height: 70, paddingTop: 8 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Room', tabBarIcon: () => <Icon emoji="🏡" /> }} />
        <Tabs.Screen name="pages" options={{ title: 'Pages', tabBarIcon: () => <Icon emoji="📝" /> }} />
        <Tabs.Screen name="coach" options={{ title: 'Coach', tabBarIcon: () => <Icon emoji="✨" /> }} />
        <Tabs.Screen name="bridge" options={{ title: 'Bridge', tabBarIcon: () => <Icon emoji="🌉" /> }} />
        <Tabs.Screen name="circle" options={{ title: 'Circle', tabBarIcon: () => <Icon emoji="🤝" /> }} />
      </Tabs>
    </SafeAreaProvider>
  );
}
