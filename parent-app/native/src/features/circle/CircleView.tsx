import React from 'react';
import { Canvas } from '../../components/Canvas';
import { PrivateGate } from '../../components/PrivateGate';

export function CircleView() {
  return <Canvas eyebrow="Parent Circle" title="Support without comparison." detail="A future community for parents to support one another, with moderation and secure adult identities."><PrivateGate feature="circle" /></Canvas>;
}
