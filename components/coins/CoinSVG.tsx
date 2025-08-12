import React from 'react';
import Svg, { Circle, Defs, Path, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

type CoinType = 'penny' | 'nickel' | 'dime' | 'quarter';

interface CoinSVGProps {
  type: CoinType;
  size: number;
}

// Coin configurations with retro flat design
const coinConfigs = {
  penny: {
    baseColor: '#CD7F32', // Copper
    accentColor: '#8B4513', // Darker copper
    borderColor: '#654321', // Dark copper border
    value: '1¢',
    name: 'PENNY',
  },
  nickel: {
    baseColor: '#C0C0C0', // Silver
    accentColor: '#A0A0A0', // Darker silver
    borderColor: '#808080', // Dark silver border
    value: '5¢',
    name: 'NICKEL',
  },
  dime: {
    baseColor: '#C0C0C0', // Silver
    accentColor: '#A0A0A0', // Darker silver
    borderColor: '#808080', // Dark silver border
    value: '10¢',
    name: 'DIME',
  },
  quarter: {
    baseColor: '#C0C0C0', // Silver
    accentColor: '#A0A0A0', // Darker silver
    borderColor: '#808080', // Dark silver border
    value: '25¢',
    name: 'QUARTER',
  },
};

export default function CoinSVG({ type, size }: CoinSVGProps) {
  const config = coinConfigs[type];
  const radius = size / 2;
  const textSize = size * 0.15;
  const valueSize = size * 0.2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id={`gradient-${type}`} cx="0.3" cy="0.3" r="0.8">
          <Stop offset="0%" stopColor={config.baseColor} />
          <Stop offset="100%" stopColor={config.accentColor} />
        </RadialGradient>
      </Defs>

      {/* Outer border with retro flat shadow effect */}
      <Circle cx={radius + 2} cy={radius + 2} r={radius - 2} fill="#00000020" />

      {/* Main coin body */}
      <Circle
        cx={radius}
        cy={radius}
        r={radius - 3}
        fill={`url(#gradient-${type})`}
        stroke={config.borderColor}
        strokeWidth="3"
      />

      {/* Inner decorative ring */}
      <Circle
        cx={radius}
        cy={radius}
        r={radius - 8}
        fill="none"
        stroke={config.borderColor}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Halftone dots pattern for retro effect */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = i * 45 * (Math.PI / 180);
        const dotRadius = radius - 15;
        const x = radius + Math.cos(angle) * dotRadius;
        const y = radius + Math.sin(angle) * dotRadius;
        return <Circle key={`dot-${type}-${i}`} cx={x} cy={y} r="1.5" fill="#FFFFFF40" />;
      })}

      {/* Value text */}
      <SvgText
        x={radius}
        y={radius - valueSize / 2}
        textAnchor="middle"
        fontSize={valueSize}
        fontWeight="bold"
        fill="#FFFFFF"
        stroke={config.borderColor}
        strokeWidth="0.5"
      >
        {config.value}
      </SvgText>

      {/* Coin name */}
      <SvgText
        x={radius}
        y={radius + textSize}
        textAnchor="middle"
        fontSize={textSize}
        fontWeight="600"
        fill="#FFFFFF"
        stroke={config.borderColor}
        strokeWidth="0.3"
        opacity="0.9"
      >
        {config.name}
      </SvgText>
    </Svg>
  );
}
