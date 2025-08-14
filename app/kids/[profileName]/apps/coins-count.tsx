import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Coin, { COINS } from '@/components/Coin';
import DottedPattern from '@/components/DottedPattern';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { useProfileByName } from '@/hooks/useProfiles';
import type { CoinsCountConfig } from '@/types/app';

function CoinsCountGame({ config }: { config: CoinsCountConfig }) {
  // Game state
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Simple coin setup - one penny (1 cent)
  const displayedCoins = [{ id: 1, type: COINS[0] }]; // penny
  const correctAnswer = 1;

  const MAX_PROGRESS = 10;

  const handleNumberPress = (num: string) => {
    if (userGuess.length < 3) {
      setUserGuess(userGuess + num);
    }
  };

  const handleBackspace = () => {
    setUserGuess(userGuess.slice(0, -1));
  };

  const checkAnswer = () => {
    if (!userGuess) return;

    const guess = parseInt(userGuess);

    if (guess === correctAnswer) {
      setFeedback(`Correct! That's ${correctAnswer}¢`);
      setProgress(progress + 1);
      setAttempts(0);
      // Reset for next round
      setTimeout(() => {
        setUserGuess('');
        setFeedback(null);
      }, 2000);
    } else {
      setAttempts(attempts + 1);
      if (config.hintDirectionWhenWrong) {
        if (guess > correctAnswer) {
          setFeedback('Too high! Try again.');
        } else {
          setFeedback('Too low! Try again.');
        }
      } else {
        setFeedback('Wrong! Try again.');
      }

      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

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
        {feedback && (
          <Box
            className={`p-4 absolute m-4 top-0 left-0 right-0 rounded-lg border-4 z-10 shadow-lg ${
              feedback.includes('Correct') ? 'bg-green-200 border-green-500' : 'bg-red-200 border-red-500'
            }`}
          >
            <Text
              className={`font-bold text-center ${feedback.includes('Correct') ? 'text-green-800' : 'text-red-800'}`}
            >
              {feedback}
            </Text>
          </Box>
        )}

        <Box className="flex-1 p-4 gap-4">
          {/* Header with progress and instruction */}
          <Box className="gap-4">
            <Box className="w-full">
              <Progress
                className="w-full h-4 bg-stone-950 rounded-full shadow-md"
                value={(progress / MAX_PROGRESS) * 100}
              >
                <ProgressFilledTrack className="bg-blue-500 h-full rounded-full" />
              </Progress>
            </Box>
            <Box className="items-center">
              <Text className="text-lg text-white font-medium text-center">How much money is shown?</Text>
            </Box>
          </Box>

          {/* Coin display area */}
          <Box className="flex-1 bg-blue-100 rounded-lg p-4 border-4 border-blue-300 min-h-[200px]">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Box className="flex-row flex-wrap justify-center items-center gap-2">
                {displayedCoins.map((coin) => (
                  <Box key={coin.id}>
                    <Coin type={coin.type} sizeMultiplier={0.8} />
                  </Box>
                ))}
              </Box>
            </ScrollView>
          </Box>

          {/* User input display */}
          <Box className="bg-white rounded-lg p-4 border-2 border-gray-300">
            <Text className="text-4xl font-bold text-gray-800 text-center">{userGuess ? `${userGuess}¢` : '_ _'}</Text>
          </Box>

          {/* Number pad */}
          <Box className="bg-stone-800 rounded-lg p-4 border-4 border-stone-700 shadow-md">
            <Box className="gap-2">
              {/* Numbers 1-3 */}
              <Box className="flex-row justify-center gap-2">
                {[1, 2, 3].map((num) => (
                  <Pressable key={num} onPress={() => handleNumberPress(num.toString())} className="flex-1">
                    <Box className="bg-white rounded-lg p-4 border-2 border-gray-300 items-center shadow-sm">
                      <Text className="text-gray-800 text-2xl font-bold">{num}</Text>
                    </Box>
                  </Pressable>
                ))}
              </Box>

              {/* Bottom row: Backspace, 0, Check */}
              <Box className="flex-row justify-center gap-2">
                <Pressable onPress={handleBackspace} className="flex-1">
                  <Box className="bg-red-500 rounded-lg p-4 border-2 border-red-600 items-center shadow-sm">
                    <Text className="text-white text-xl font-bold">⌫</Text>
                  </Box>
                </Pressable>

                <Pressable onPress={() => handleNumberPress('0')} className="flex-1">
                  <Box className="bg-white rounded-lg p-4 border-2 border-gray-300 items-center shadow-sm">
                    <Text className="text-gray-800 text-2xl font-bold">0</Text>
                  </Box>
                </Pressable>

                <Pressable onPress={checkAnswer} className="flex-1">
                  <Box className="bg-green-500 rounded-lg p-4 border-2 border-green-600 items-center shadow-sm">
                    <Text className="text-white text-xl font-bold">✓</Text>
                  </Box>
                </Pressable>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
}

export default function CoinsCount() {
  const { profileName } = useLocalSearchParams();
  const profile = useProfileByName(profileName as string);

  if (!profile || !profile.appConfig['coins-count']?.visible) {
    return <Redirect href="/" />;
  }

  const config = profile.appConfig['coins-count'];

  return <CoinsCountGame config={config} />;
}
