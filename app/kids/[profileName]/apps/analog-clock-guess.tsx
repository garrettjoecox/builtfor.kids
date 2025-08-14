import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import DottedPattern from '@/components/DottedPattern';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { useProfileByName } from '@/hooks/useProfiles';
import type { AnalogClockGuessConfig } from '@/types/app';

// Number of correct answers needed to fill progress bar
const MAX_PROGRESS = 10;

function AnalogClockGame({ config }: { config: AnalogClockGuessConfig }) {
  // Target time
  const [targetHour, setTargetHour] = useState(0);
  const [targetMinute, setTargetMinute] = useState(0);

  // User's guess (in format "HH:MM" or partial)
  const [userGuess, setUserGuess] = useState('');

  // Game state
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect'>('playing');

  // Feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Game score and progress
  const [progress, setProgress] = useState(0);

  // Track attempts for current round
  const [attempts, setAttempts] = useState(0);

  // Get minute increment based on granularity
  const getMinuteIncrement = useCallback(() => {
    switch (config.granularity) {
      case '1-minute':
        return 1;
      case '5-minutes':
        return 5;
      case '15-minutes':
        return 15;
      case '30-minutes':
        return 30;
      case 'hour':
        return 60;
      default:
        return 5;
    }
  }, [config.granularity]);

  // Initialize or reset the game
  const resetGame = useCallback(() => {
    // Clear previous state
    setUserGuess('');
    setGameState('playing');
    setFeedbackMessage(null);
    setAttempts(0);

    // Generate a random time based on granularity
    // Hours from 1-12
    const hour = Math.floor(Math.random() * 12) + 1;

    // Minutes based on granularity
    const minuteIncrement = getMinuteIncrement();
    const maxMinuteSlots = 60 / minuteIncrement;
    const minute = Math.floor(Math.random() * maxMinuteSlots) * minuteIncrement;

    setTargetHour(hour);
    setTargetMinute(minute);
  }, [getMinuteIncrement]);

  // Initialize game on first load
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Reset game after showing the result
  useEffect(() => {
    if (gameState === 'correct') {
      const timer = setTimeout(() => {
        resetGame();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (gameState === 'incorrect') {
      const timer = setTimeout(() => {
        setGameState('playing');
        setFeedbackMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState, resetGame]);

  // Handle number pad input
  const handleNumberPress = (num: string) => {
    if (gameState !== 'playing') return;

    // Check if we already have a valid time format
    if (userGuess.includes(':')) {
      const [hours, minutes] = userGuess.split(':');

      // If minutes part exists and has less than 2 digits
      if (minutes !== undefined && minutes.length < 2) {
        const newMinutes = minutes + num;
        // Don't allow minutes > 59
        if (parseInt(newMinutes) <= 59) {
          setUserGuess(`${hours}:${newMinutes}`);
        }
      }
    } else {
      // We're still in hour input
      if (userGuess.length === 0) {
        // First digit
        setUserGuess(num);
      } else if (userGuess.length === 1) {
        // Second digit - check if it makes a valid hour (1-12)
        const hourValue = parseInt(userGuess + num);
        if (hourValue >= 1 && hourValue <= 12) {
          setUserGuess(userGuess + num);
        }
      }
    }
  };

  // Handle colon button
  const handleColon = () => {
    if (gameState !== 'playing' || userGuess.includes(':') || userGuess.length === 0) return;

    const hourValue = parseInt(userGuess);
    if (hourValue >= 1 && hourValue <= 12) {
      setUserGuess(userGuess + ':');
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (gameState !== 'playing') return;
    setUserGuess(userGuess.slice(0, -1));
  };

  // Handle submit
  const handleSubmit = () => {
    if (gameState !== 'playing' || !userGuess.includes(':')) return;

    const [hoursStr, minutesStr] = userGuess.split(':');
    const guessHour = parseInt(hoursStr);
    const guessMinute = parseInt(minutesStr);

    // Validate the guess format
    if (
      Number.isNaN(guessHour) ||
      Number.isNaN(guessMinute) ||
      guessHour < 1 ||
      guessHour > 12 ||
      guessMinute < 0 ||
      guessMinute > 59
    ) {
      setFeedbackMessage('Please enter a valid time');
      return;
    }

    setAttempts(attempts + 1);

    // Check if the answer is correct
    if (guessHour === targetHour && guessMinute === targetMinute) {
      setGameState('correct');
      setFeedbackMessage('🎉 Correct! Great job! 🎉');
      setProgress(progress + 1);
    } else {
      setGameState('incorrect');
      const targetTimeStr = `${targetHour}:${targetMinute.toString().padStart(2, '0')}`;
      setFeedbackMessage(`Try again! The correct time is ${targetTimeStr}`);
    }
  };

  // Get display time for input field
  const getDisplayTime = () => {
    if (userGuess.length === 0) {
      return '--:--';
    }

    if (!userGuess.includes(':')) {
      return userGuess + ':--';
    }

    const [hours, minutes] = userGuess.split(':');
    return `${hours}:${minutes.padEnd(2, '-')}`;
  };

  // Calculate angles for clock hands
  const hourAngle = ((targetHour % 12) / 12) * 360 + (targetMinute / 60) * 30 - 90;
  const minuteAngle = (targetMinute / 60) * 360 - 90;

  // Clock component
  const ClockDisplay = () => (
    <Box className="items-center justify-center">
      <Svg width="250" height="250" viewBox="0 0 250 250">
        {/* Clock face */}
        <Circle cx="125" cy="125" r="120" fill="white" stroke="black" strokeWidth="3" />

        {/* Clock numbers */}
        {[...Array(12)].map((_, i) => {
          const angle = ((i + 1) / 12) * 2 * Math.PI - Math.PI / 2;
          const x = 100 * Math.cos(angle) + 125;
          const y = 100 * Math.sin(angle) + 125;
          return (
            <SvgText
              key={`clock-number-${i + 1}`}
              x={x}
              y={y + 6}
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
              fill="black"
            >
              {i + 1}
            </SvgText>
          );
        })}

        {/* Hour hand */}
        <Line
          x1="125"
          y1="125"
          x2={125 + 60 * Math.cos((hourAngle * Math.PI) / 180)}
          y2={125 + 60 * Math.sin((hourAngle * Math.PI) / 180)}
          stroke="black"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <Line
          x1="125"
          y1="125"
          x2={125 + 90 * Math.cos((minuteAngle * Math.PI) / 180)}
          y2={125 + 90 * Math.sin((minuteAngle * Math.PI) / 180)}
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <Circle cx="125" cy="125" r="8" fill="black" />
      </Svg>
    </Box>
  );

  return (
    <SafeAreaView className="bg-stone-900 flex-1">
      <Box className="flex-1 border-b-4 border-stone-700 relative">
        <Box className="bg-stone-900 border-b-4 border-stone-700 items-start" style={{ zIndex: 1 }}>
          <Link href="/" asChild>
            <Button variant="link" className="px-3 mt-[-10px]">
              <ButtonText>← Home</ButtonText>
            </Button>
          </Link>
        </Box>
        <DottedPattern />

        {/* Feedback message */}
        {feedbackMessage && (
          <Box
            className={`p-4 absolute m-4 top-0 left-0 right-0 rounded-lg border-4 z-10 shadow-lg ${
              gameState === 'correct' ? 'bg-green-200 border-green-500' : 'bg-amber-200 border-amber-500'
            }`}
          >
            <Text className={`font-bold text-center ${gameState === 'correct' ? 'text-green-800' : 'text-amber-800'}`}>
              {feedbackMessage}
            </Text>
          </Box>
        )}

        <Box className="flex-1 p-4 gap-4">
          {/* Progress bar */}
          <Box className="w-full">
            <Progress
              className="w-full h-4 bg-stone-950 rounded-full shadow-md"
              value={(progress / MAX_PROGRESS) * 100}
            >
              <ProgressFilledTrack className="bg-purple-500 h-full rounded-full" />
            </Progress>
          </Box>

          {/* Instruction */}
          <Box className="items-center">
            <Text className="text-lg text-stone-300 font-medium text-center">What time is shown on the clock?</Text>
            <Text className="text-sm text-stone-500 text-center">
              Enter the time in format hour:minutes (example: 3:15)
            </Text>
          </Box>

          {/* Clock display area */}
          <Box className="flex-1 bg-blue-100 rounded-lg p-4 border-4 border-blue-300 min-h-[300px] justify-center">
            <ClockDisplay />
          </Box>

          {/* User input display */}
          <Box className="bg-white rounded-lg p-4 border-2 border-stone-300 items-center">
            <Text className="text-5xl font-bold text-stone-800">{getDisplayTime()}</Text>
          </Box>

          {/* Number pad */}
          <Box className="bg-stone-800 rounded-lg p-4 border-4 border-stone-700">
            <Box className="gap-2">
              {/* Numbers 1-9 */}
              <Box className="flex-row justify-center gap-2">
                {[1, 2, 3].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => handleNumberPress(num.toString())}
                    className="bg-white rounded-lg flex-1 items-center justify-center py-4 shadow-md"
                  >
                    <Text className="text-stone-800 text-2xl font-bold">{num}</Text>
                  </Pressable>
                ))}
              </Box>
              <Box className="flex-row justify-center gap-2">
                {[4, 5, 6].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => handleNumberPress(num.toString())}
                    className="bg-white rounded-lg flex-1 items-center justify-center py-4 shadow-md"
                  >
                    <Text className="text-stone-800 text-2xl font-bold">{num}</Text>
                  </Pressable>
                ))}
              </Box>
              <Box className="flex-row justify-center gap-2">
                {[7, 8, 9].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => handleNumberPress(num.toString())}
                    className="bg-white rounded-lg flex-1 items-center justify-center py-4 shadow-md"
                  >
                    <Text className="text-stone-800 text-2xl font-bold">{num}</Text>
                  </Pressable>
                ))}
              </Box>

              {/* Bottom row: Backspace, 0, Colon/Submit */}
              <Box className="flex-row justify-center gap-2">
                <Pressable
                  onPress={handleBackspace}
                  className="bg-amber-500 rounded-lg flex-1 items-center justify-center py-4 shadow-md"
                >
                  <Text className="text-white text-xl font-bold">⌫</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress('0')}
                  className="bg-white rounded-lg flex-1 items-center justify-center py-4 shadow-md"
                >
                  <Text className="text-stone-800 text-2xl font-bold">0</Text>
                </Pressable>
                <Pressable
                  onPress={userGuess.includes(':') ? handleSubmit : handleColon}
                  className="bg-green-500 rounded-lg flex-1 items-center justify-center py-4 shadow-md"
                >
                  <Text className="text-white text-xl font-bold">{userGuess.includes(':') ? '✓' : ':'}</Text>
                </Pressable>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
}

export default function AnalogClockGuess() {
  const { profileName } = useLocalSearchParams();
  const profile = useProfileByName(profileName as string);

  if (!profile || !profile.appConfig['analog-clock-guess']?.visible) {
    return <Redirect href="/" />;
  }

  const config = profile.appConfig['analog-clock-guess'];

  return <AnalogClockGame config={config} />;
}
