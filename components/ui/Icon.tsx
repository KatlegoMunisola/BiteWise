import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSize } from '../../constants/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface Props {
  name: IoniconName;
  size?: keyof typeof iconSize | number;
  color?: string;
}

export default function Icon({ name, size = 'md', color = colors.text }: Props) {
  const resolvedSize = typeof size === 'number' ? size : iconSize[size];
  return <Ionicons name={name} size={resolvedSize} color={color} />;
}
