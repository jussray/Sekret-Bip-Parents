import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Canvas, Glass } from '../../components/Canvas';
import { getParentMoodReply, parentMoods, type ParentMood } from './mood';
import { palette } from '../../theme';

export function RoomView() {
  const [mood, setMood] = useState<ParentMood | null>(null);
  return (
    <Canvas
      eyebrow="A space to return to yourself"
      title={'Come on in.\nYou can set it down here.'}
      detail="Supporting your teen starts with supporting yourself. No surveillance. No pressure. Just room to grow."
    >
      <Glass>
        <Text style={styles.note}>✧ A little reminder</Text>
        <Text style={styles.polaroid}>“Connection begins with listening, not knowing everything.”</Text>
        <Text style={styles.signature}>— Se’kret</Text>
      </Glass>
      <Glass>
        <Text style={styles.head}>What’s your weather today?</Text>
        <View style={styles.moods}>
          {parentMoods.map(item => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityState={{ selected: mood === item.key }}
              onPress={() => setMood(item.key)}
              style={[styles.mood, mood === item.key && styles.active]}
            >
              <Text style={styles.moodLabel}>{item.icon} {item.label}</Text>
            </Pressable>
          ))}
        </View>
        <Text accessibilityLiveRegion="polite" style={styles.reply}>
          {mood ? getParentMoodReply(mood) : 'This check-in stays in app memory only. Nothing is sent or saved.'}
        </Text>
      </Glass>
    </Canvas>
  );
}
const styles = StyleSheet.create({
  note: { color: palette.glow, letterSpacing: 1.4, fontSize: 12, marginBottom: 12 },
  polaroid: { color: palette.text, fontFamily: 'serif', fontSize: 24, lineHeight: 34 },
  signature: { color: palette.pink, textAlign: 'right', marginTop: 14 },
  head: { color: palette.text, fontSize: 19, fontWeight: '700', marginBottom: 14 },
  moods: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mood: { borderWidth: 1, borderColor: palette.border, borderRadius: 22, paddingHorizontal: 13, paddingVertical: 11, backgroundColor: '#392957' },
  active: { backgroundColor: '#704b9d', borderColor: palette.pink },
  moodLabel: { color: palette.text, fontSize: 14 },
  reply: { color: palette.muted, marginTop: 17, lineHeight: 21 },
});
