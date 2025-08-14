import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
  // Total value of displayed coins in cents
  const [totalValue, setTotalValue] = useState(6);
  // Coins to display - initialize with test coins
  const [displayedCoins, setDisplayedCoins] = useState<Array<{ id: number; type: (typeof COINS)[number] }>>([
    { id: 1, type: COINS[0] }, // penny
    { id: 2, type: COINS[1] }, // nickel  
  ]);
  // User's guess as string for input handling
  const [userGuess, setUserGuess] = useState('');
  // Game state
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect'>('playing');
  // Feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  // Game score and progress
  const [progress, setProgress] = useState(0);
  // Track attempts for current round
  const [attempts, setAttempts] = useState(0);

  // Number of correct answers needed to fill progress bar
  const MAX_PROGRESS = 10;

  // Initialize or reset the game
  const resetGame = () => {
    // Clear previous state
    setDisplayedCoins([]);
    setUserGuess('');
    setGameState('playing');
    setFeedbackMessage(null);
    setAttempts(0);

    // Generate a simple random value within bounds and then create coins for that value
    const targetValue = Math.floor(Math.random() * (config.upperBound - config.lowerBound + 1)) + config.lowerBound;
    
    // Create coins that add up to the target value
    const coins: Array<{ id: number; type: (typeof COINS)[number] }> = [];
    let remainingValue = targetValue;
    let idCounter = 0;
    
    // Start with larger coins and work down
    for (const coin of [...COINS].reverse()) {
      while (remainingValue >= coin.value) {
        coins.push({
          id: idCounter++,
          type: coin
        });
        remainingValue -= coin.value;
      }
    }
    
    // Shuffle the coins for display
    for (let i = coins.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coins[i], coins[j]] = [coins[j], coins[i]];
    }
    
    setDisplayedCoins(coins);
    setTotalValue(targetValue);
  };

  // Initialize game on first load - removed useEffect to avoid infinite loop
  // Coins are now initialized directly in useState above

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
  }, [gameState]);

  // Handle number pad input
  const handleNumberPress = (num: string) => {
    if (gameState !== 'playing') return;

    if (userGuess.length < 3) {
      // Limit to 3 digits (up to 999 cents)
      setUserGuess(userGuess + num);
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (gameState !== 'playing') return;
    setUserGuess(userGuess.slice(0, -1));
  };

  // Check the user's answer
  const checkAnswer = () => {
    if (!userGuess || gameState !== 'playing') return;

    const guess = parseInt(userGuess);
    setAttempts(attempts + 1);

    if (guess === totalValue) {
      setGameState('correct');
      setFeedbackMessage(`Correct! That's ${formatMoney(totalValue)}`);
      setProgress(progress + 1);
    } else {
      setGameState('incorrect');

      if (attempts >= 2) {
        setFeedbackMessage(`The correct answer is ${formatMoney(totalValue)}`);
      } else if (config.hintDirectionWhenWrong) {
        if (guess > totalValue) {
          setFeedbackMessage('Too high! Try again.');
        } else {
          setFeedbackMessage('Too low! Try again.');
        }
      } else {
        setFeedbackMessage('Wrong! Try again.');
      }
    }
  };

  // Format cents as dollars and cents
  const formatMoney = (cents: number) => {
    const dollars = Math.floor(cents / 100);
    const remainingCents = cents % 100;

    if (dollars > 0) {
      return `$${dollars}.${remainingCents.toString().padStart(2, '0')}`;
    } else {
      return `${cents}¢`;
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
        {feedbackMessage && (
          <Box
            className={`p-4 absolute m-4 top-0 left-0 right-0 rounded-lg border-4 z-10 shadow-lg ${
              gameState === 'correct' ? 'bg-green-200 border-green-500' : 'bg-red-200 border-red-500'
            }`}
          >
            <Text className={`font-bold text-center ${gameState === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
              {feedbackMessage}
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

          {/* Footer */}
          <Box className="gap-4">
            {gameState === 'correct' ? (
              <Box className="p-4 rounded-lg border-4 items-center shadow-md bg-green-200 border-green-500">
                <Text className="font-bold text-green-800">🎉 Correct! Great job! 🎉</Text>
              </Box>
            ) : (
              <Box className="gap-4">
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

                    {/* Numbers 4-6 */}
                    <Box className="flex-row justify-center gap-2">
                      {[4, 5, 6].map((num) => (
                        <Pressable key={num} onPress={() => handleNumberPress(num.toString())} className="flex-1">
                          <Box className="bg-white rounded-lg p-4 border-2 border-gray-300 items-center shadow-sm">
                            <Text className="text-gray-800 text-2xl font-bold">{num}</Text>
                          </Box>
                        </Pressable>
                      ))}
                    </Box>

                    {/* Numbers 7-9 */}
                    <Box className="flex-row justify-center gap-2">
                      {[7, 8, 9].map((num) => (
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
            )}
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
