import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Canvas, Glass } from '../../components/Canvas';
import { conversationKits, selectCoachPrompt, type ConversationTopic } from './prompts';
import { palette } from '../../theme';

export function CoachView() {
  const [topic, setTopic] = useState<ConversationTopic>('Check-in');
  const [index, setIndex] = useState(0);
  return (
    <Canvas eyebrow="Conversation kits · Parent Coach" title={'When words are hard,\nstart small.'} detail="General conversation starters, not AI interpretations of your teen’s private thoughts.">
      <Glass>
        <Text style={styles.heading}>What's happening?</Text>
        <View style={styles.row}>
          {(Object.keys(conversationKits) as ConversationTopic[]).map(item => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: topic === item }}
              style={[styles.chip, topic === item && styles.selected]}
              onPress={() => { setTopic(item); setIndex(0); }}
            >
              <Text style={styles.label}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </Glass>
      <Glass>
        <Text style={styles.caption}>YOU COULD SAY</Text>
        <Text style={styles.prompt}>{'“' + selectCoachPrompt(topic, index) + '”'}</Text>
        <Pressable accessibilityRole="button" style={styles.button} onPress={() => setIndex(current => current + 1)}>
          <Text style={styles.buttonLabel}>Try another ↻</Text>
        </Pressable>
      </Glass>
    </Canvas>
  );
}
const styles = StyleSheet.create({
  heading: { color: palette.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderColor: palette.border, borderWidth: 1, padding: 12, borderRadius: 28 },
  selected: { backgroundColor: '#754b9d', borderColor: palette.pink },
  label: { color: palette.text },
  caption: { color: palette.glow, fontSize: 11, letterSpacing: 1.4, marginBottom: 18 },
  prompt: { fontFamily: 'serif', fontSize: 25, lineHeight: 36, color: palette.text },
  button: { marginTop: 26, backgroundColor: '#d7aff2', padding: 15, borderRadius: 18, alignItems: 'center' },
  buttonLabel: { color: '#271331', fontWeight: '800' },
});
