import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Canvas, Glass } from '../../components/Canvas';
import { MAX_REFLECTION_LENGTH, reflectionCount } from './draft';
import { palette } from '../../theme';

export function ReflectionsView() {
  const [draft, setDraft] = useState('');
  return (
    <Canvas
      eyebrow="Parent Pages · Your quiet corner"
      title="A pause before the reply."
      detail="Write your first response before deciding what you want to say. This draft stays only in temporary app memory. It is never uploaded or saved."
    >
      <Glass>
        <Text style={styles.heading}>What do you want them to know?</Text>
        <TextInput
          accessibilityLabel="Private parent reflection draft"
          multiline
          maxLength={MAX_REFLECTION_LENGTH}
          style={styles.input}
          placeholder="I want you to know I’m here to listen…"
          placeholderTextColor="#b4a8c6"
          value={draft}
          onChangeText={setDraft}
          textAlignVertical="top"
        />
        <Text style={styles.count}>{reflectionCount(draft)}</Text>
        <Pressable accessibilityRole="button" onPress={() => setDraft('')} style={styles.button}>
          <Text style={styles.buttonText}>Clear my page</Text>
        </Pressable>
      </Glass>
      <Text style={styles.helper}>This is your space, not a report about your child.</Text>
    </Canvas>
  );
}
const styles = StyleSheet.create({
  heading: { color: palette.text, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  input: { minHeight: 240, color: palette.text, backgroundColor: '#100c27', padding: 16, borderRadius: 14, fontSize: 16, lineHeight: 24, borderWidth: 1, borderColor: palette.border },
  count: { color: palette.muted, textAlign: 'right', marginTop: 8 },
  button: { padding: 14, borderRadius: 14, backgroundColor: '#6d4997', marginTop: 12, alignItems: 'center' },
  buttonText: { color: palette.text, fontWeight: '700' },
  helper: { color: palette.muted, fontSize: 13, lineHeight: 22 },
});
