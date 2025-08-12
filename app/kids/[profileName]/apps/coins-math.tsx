import { Redirect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView } from 'react-native';
import Coin, { COINS } from '@/components/Coin';
import DottedPattern from '@/components/DottedPattern';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { useProfileByName } from '@/hooks/useProfiles';

// Number of correct answers needed to fill progress bar
const MAX_PROGRESS = 10;

function CoinGame() {
  // Target amount in cents (1-150)
  const [targetAmount, setTargetAmount] = useState(0);
  // Selected coins with unique IDs
  const [selectedCoins, setSelectedCoins] = useState<Array<{ id: number; type: (typeof COINS)[number] }>>([]);
  // Game state
  const [gameState, setGameState] = useState<'playing' | 'correct'>('playing');
  // Counter for unique IDs
  const [idCounter, setIdCounter] = useState(0);
  // Error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Game score and progress
  const [progress, setProgress] = useState(0);

  // Initialize or reset the game
  const resetGame = useCallback(() => {
    // Random amount between 1 and 150 cents
    const newAmount = Math.floor(Math.random() * 150) + 1;
    setTargetAmount(newAmount);
    setSelectedCoins([]);
    setGameState('playing');
    setErrorMessage(null);
  }, []);

  // Initialize game on first load
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Reset game after 3 seconds of displaying the result
  useEffect(() => {
    if (gameState === 'correct') {
      const timer = setTimeout(() => {
        resetGame();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, resetGame]);

  // Add a coin to the pool
  const addCoin = (coinType: (typeof COINS)[number]) => {
    if (gameState === 'playing') {
      const coinCount = selectedCoins.filter((coin) => coin.type.name === coinType.name).length;

      if (coinCount >= coinType.max) {
        setErrorMessage('Try something else!');
        return;
      }

      // Clear any existing error when adding a valid coin
      setErrorMessage(null);
      setSelectedCoins([...selectedCoins, { id: idCounter, type: coinType }]);
      setIdCounter(idCounter + 1);
    }
  };

  // Hide the error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Remove a coin from the pool
  const removeCoin = (id: number) => {
    if (gameState === 'playing') {
      setSelectedCoins(selectedCoins.filter((coin) => coin.id !== id));
      setErrorMessage(null);
    }
  };

  // Calculate total value of selected coins
  const totalValue = selectedCoins.reduce((sum, coin) => sum + coin.type.value, 0);

  // Check if the answer is correct
  const checkAnswer = () => {
    if (totalValue === targetAmount) {
      setGameState('correct');
      setProgress(progress + 1);
    } else {
      setErrorMessage(`Wrong! You have ${formatMoney(totalValue)}, try again.`);
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
      <Box className="flex-1 border-y-4 border-stone-700 relative">
        <DottedPattern />

        {/* Error message */}
        {errorMessage && (
          <Box className="bg-red-200 p-4 absolute m-4 top-0 left-0 right-0 rounded-lg border-4 border-red-500 z-10 shadow-lg">
            <Text className="text-red-800 font-bold text-center">{errorMessage}</Text>
          </Box>
        )}

        <Box className="flex-1 p-4 gap-4">
          {/* Header with progress and target amount */}
          <Box className="gap-4">
            <Box className="w-full">
              <Progress
                className="w-full h-4 bg-stone-300 rounded-full shadow-inner border-2 border-stone-400"
                value={(progress / MAX_PROGRESS) * 100}
              >
                <ProgressFilledTrack
                  className="bg-green-500 h-full rounded-full shadow-sm"
                  style={{ width: `${(progress / MAX_PROGRESS) * 100}%` }}
                />
              </Progress>
            </Box>
            <Box className="items-center">
              <Text className="text-6xl font-bold text-green-600">{formatMoney(targetAmount)}</Text>
            </Box>
          </Box>

          {/* Coin pool */}
          <Box className="flex-1 bg-stone-200 rounded-lg p-4 border-4 border-stone-400 shadow-inner">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Box className="flex-row flex-wrap justify-center items-center gap-2">
                {selectedCoins.length === 0 ? (
                  <Text className="p-4 text-stone-600 italic text-center">Tap coins below to add them here</Text>
                ) : (
                  selectedCoins.map((coin) => (
                    <Box key={coin.id} className="shadow-md">
                      <Pressable onPress={() => removeCoin(coin.id)}>
                        <Coin type={coin.type} sizeMultiplier={0.6} />
                      </Pressable>
                    </Box>
                  ))
                )}
              </Box>
            </ScrollView>
          </Box>

          {/* Footer */}
          <Box className="gap-4">
            {gameState === 'correct' ? (
              <Box className="bg-green-200 p-4 rounded-lg border-4 border-green-500 items-center shadow-lg">
                <Text className="text-green-800 text-xl font-bold">🎉 Correct! Great job! 🎉</Text>
              </Box>
            ) : (
              <Box className="items-center">
                <Button
                  onPress={checkAnswer}
                  className="bg-stone-600 border-2 border-stone-700 px-8 py-2 rounded-full shadow-lg"
                >
                  <ButtonText className="text-white text-lg font-bold">Check Answer</ButtonText>
                </Button>
              </Box>
            )}

            <Box className="bg-stone-300 rounded-lg p-4 border-4 border-stone-500 shadow-inner">
              <Box className="flex-row justify-center gap-4 flex-wrap">
                {COINS.map((coin) => (
                  <Pressable
                    key={coin.name}
                    className="items-center active:scale-95 shadow-lg"
                    onPress={() => addCoin(coin)}
                  >
                    <Box className="items-center">
                      <Coin type={coin} sizeMultiplier={0.7} />
                      <Text className="mt-2 text-sm font-bold text-stone-800 capitalize">{coin.name}</Text>
                      <Text className="text-xs text-stone-600 font-medium">{coin.value}¢</Text>
                    </Box>
                  </Pressable>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
}

export default function CoinsMath() {
  const { profileName } = useLocalSearchParams();
  const profile = useProfileByName(profileName as string);

  if (!profile || !profile.appConfig['coins-math']?.visible) {
    return <Redirect href="/" />;
  }

  return <CoinGame />;
}
