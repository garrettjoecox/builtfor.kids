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
import type { CoinsMathConfig } from '@/types/app';

function CoinGame({ config }: { config: CoinsMathConfig }) {
  // Target amount in cents (based on config bounds)
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
    // Random amount between lowerBound and upperBound cents
    const range = config.upperBound - config.lowerBound + 1;
    const newAmount = Math.floor(Math.random() * range) + config.lowerBound;
    setTargetAmount(newAmount);
    setSelectedCoins([]);
    setGameState('playing');
    setErrorMessage(null);
  }, [config.lowerBound, config.upperBound]);

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

      if (config.preventOveruse && coinCount >= coinType.max) {
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
      if (config.displayAmountWhenWrong) {
        setErrorMessage(`Wrong! You have ${formatMoney(totalValue)}, try again.`);
      } else {
        setErrorMessage('Wrong! Try again.');
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

        {/* Error message */}
        {errorMessage && (
          <Box className="bg-red-200 p-4 absolute m-4 top-0 left-0 right-0 rounded-lg border-4 border-red-500 z-10 shadow-lg">
            <Text className="text-red-800 font-bold text-center">{errorMessage}</Text>
          </Box>
        )}

        <Box className="flex-1 p-4 gap-4">
          {/* Header with progress and target amount */}
          <Box className="gap-4">
            {config.showProgressBar && (
              <Box className="w-full">
                <Progress
                  className="w-full h-4 bg-stone-950 rounded-full shadow-md"
                  value={(progress / config.progressPerAnswer) * 100}
                >
                  <ProgressFilledTrack className="bg-green-500 h-full rounded-full" />
                </Progress>
              </Box>
            )}
            <Box className="items-center">
              <Text className="text-6xl font-bold text-green-600">{formatMoney(targetAmount)}</Text>
            </Box>
          </Box>

          {/* Coin pool */}
          <Box className="flex-1 bg-stone-800 rounded-lg p-4 border-4 border-stone-700 shadow-md">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Box className="flex-row flex-wrap justify-center items-center gap-2">
                {selectedCoins.length === 0 ? (
                  <Text className="p-4 text-stone-600 italic text-center">Tap coins below to add them here</Text>
                ) : (
                  selectedCoins.map((coin) => (
                    <Pressable key={coin.id} onPress={() => removeCoin(coin.id)}>
                      <Box className="">
                        <Coin type={coin.type} sizeMultiplier={0.7} />
                      </Box>
                    </Pressable>
                  ))
                )}
              </Box>
            </ScrollView>
          </Box>

          {/* Footer */}
          <Box className="gap-4">
            {gameState === 'correct' ? (
              <Box className="p-4 rounded-lg border-4 items-center shadow-md">
                <Text className="font-bold">🎉 Correct! Great job! 🎉</Text>
              </Box>
            ) : (
              <Box className="items-center">
                <Button onPress={checkAnswer} className="bg-stone-600 border-2 border-stone-700 rounded-full shadow-md">
                  <ButtonText className="text-white text-base font-bold">Check Answer</ButtonText>
                </Button>
              </Box>
            )}

            <Box className="bg-stone-900 rounded-lg p-4 border-4 border-stone-700 shadow-md">
              <Box className="flex-row justify-center gap-4 flex-wrap">
                {COINS.map((coin) => (
                  <Pressable key={coin.name} className="items-center justify-end" onPress={() => addCoin(coin)}>
                    <Coin type={coin} sizeMultiplier={0.7} />
                    {config.displayCoinName && (
                      <Text className="mt-2 text-sm font-bold text-stone-300 capitalize">{coin.name}</Text>
                    )}
                    {config.displayCoinValue && (
                      <Text className="text-xs text-stone-500 font-medium">{coin.value}¢</Text>
                    )}
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

  const config = profile.appConfig['coins-math'];

  return <CoinGame config={config} />;
}
