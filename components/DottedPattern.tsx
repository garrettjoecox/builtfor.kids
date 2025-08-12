import { Platform, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

export default function DottedPattern() {
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="Pattern" width="10" height="10" patternUnits="userSpaceOnUse">
          {Platform.OS === 'web' ? (
            <>
              <Circle fill="rgba(255,255,255,0.1)" r="2" cx="0" cy="0" />
              <Circle fill="rgba(255,255,255,0.1)" r="2" cx="10" cy="0" />
              <Circle fill="rgba(255,255,255,0.1)" r="2" cx="0" cy="10" />
              <Circle fill="rgba(255,255,255,0.1)" r="2" cx="10" cy="10" />
              <Circle fill="rgba(255,255,255,0.1)" r="2" cx="5" cy="5" />
            </>
          ) : (
            <>
              <Circle fill="rgba(255,255,255,0.1)" r="2" x="0" y="0" />
              <Circle fill="rgba(255,255,255,0.1)" r="2" x="10" y="0" />
              <Circle fill="rgba(255,255,255,0.1)" r="2" x="0" y="10" />
              <Circle fill="rgba(255,255,255,0.1)" r="2" x="10" y="10" />
              <Circle fill="rgba(255,255,255,0.1)" r="2" x="5" y="5" />
            </>
          )}
        </Pattern>
      </Defs>
      <Rect fill="url(#Pattern)" width="100%" height="100%" />
    </Svg>
  );
}
