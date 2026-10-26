import React from 'react';
import { Canvas } from '../../components/Canvas';
import { PrivateGate } from '../../components/PrivateGate';

export function BridgeView() {
  return <Canvas eyebrow="Se’krets 2 Tell · Shared by choice" title="Bridge is built on trust." detail="Your teen owns what they share. A link alone never exposes private Pages, voice notes, messages, moods, or companion conversations."><PrivateGate feature="bridge" /></Canvas>;
}
