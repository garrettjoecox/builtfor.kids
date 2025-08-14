import { router } from 'expo-router';
import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

// Hardcoded PIN for now - in production this should be configurable
const HARDCODED_PIN = '1234';

export default function PinEntry() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinSubmit = async () => {
    setIsLoading(true);
    setError('');

    // Validate PIN length (4-8 digits)
    if (pin.length < 4 || pin.length > 8) {
      setError('PIN must be between 4-8 digits');
      setIsLoading(false);
      return;
    }

    // Validate PIN is only numbers
    if (!/^\d+$/.test(pin)) {
      setError('PIN must contain only numbers');
      setIsLoading(false);
      return;
    }

    // Check if PIN matches
    if (pin === HARDCODED_PIN) {
      // PIN is correct, navigate to parents section
      router.replace('/parents/(tabs)');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin(''); // Clear the input
    }

    setIsLoading(false);
  };

  const handleNumberPress = (number: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + number);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <SafeAreaView className="bg-stone-900 flex-1">
      <Box className="flex-1 p-6 justify-center">
        <VStack className="space-y-6 max-w-sm mx-auto w-full">
          {/* Header */}
          <VStack className="space-y-2 items-center">
            <Text className="text-6xl">🔒</Text>
            <Heading className="text-2xl text-center text-white">Parents Section</Heading>
            <Text className="text-center text-stone-400">Enter your PIN to access parental controls</Text>
          </VStack>

          {/* PIN Display */}
          <VStack className="space-y-4">
            <Input className="bg-stone-800 border-stone-700">
              <InputField
                value={pin.replace(/./g, '●')} // Show dots instead of actual PIN
                editable={false}
                placeholder="Enter PIN (4-8 digits)"
                placeholderTextColor="#a8a29e"
                className="text-center text-xl text-white tracking-widest"
                maxLength={8}
              />
            </Input>

            {error ? <Text className="text-red-400 text-center text-sm">{error}</Text> : null}
          </VStack>

          {/* Number Pad */}
          <VStack className="space-y-3">
            {/* Numbers 1-3 */}
            <HStack className="space-x-3 justify-center">
              {['1', '2', '3'].map((num) => (
                <Button
                  key={num}
                  onPress={() => handleNumberPress(num)}
                  className="w-16 h-16 bg-stone-800 border-stone-700 rounded-full"
                  disabled={isLoading}
                >
                  <ButtonText className="text-xl text-white">{num}</ButtonText>
                </Button>
              ))}
            </HStack>

            {/* Numbers 4-6 */}
            <HStack className="space-x-3 justify-center">
              {['4', '5', '6'].map((num) => (
                <Button
                  key={num}
                  onPress={() => handleNumberPress(num)}
                  className="w-16 h-16 bg-stone-800 border-stone-700 rounded-full"
                  disabled={isLoading}
                >
                  <ButtonText className="text-xl text-white">{num}</ButtonText>
                </Button>
              ))}
            </HStack>

            {/* Numbers 7-9 */}
            <HStack className="space-x-3 justify-center">
              {['7', '8', '9'].map((num) => (
                <Button
                  key={num}
                  onPress={() => handleNumberPress(num)}
                  className="w-16 h-16 bg-stone-800 border-stone-700 rounded-full"
                  disabled={isLoading}
                >
                  <ButtonText className="text-xl text-white">{num}</ButtonText>
                </Button>
              ))}
            </HStack>

            {/* 0 and action buttons */}
            <HStack className="space-x-3 justify-center">
              <Button
                onPress={handleBackspace}
                className="w-16 h-16 bg-stone-700 border-stone-600 rounded-full"
                disabled={isLoading || pin.length === 0}
              >
                <ButtonText className="text-lg text-white">⌫</ButtonText>
              </Button>

              <Button
                onPress={() => handleNumberPress('0')}
                className="w-16 h-16 bg-stone-800 border-stone-700 rounded-full"
                disabled={isLoading}
              >
                <ButtonText className="text-xl text-white">0</ButtonText>
              </Button>

              <Button
                onPress={handleClear}
                className="w-16 h-16 bg-stone-700 border-stone-600 rounded-full"
                disabled={isLoading || pin.length === 0}
              >
                <ButtonText className="text-lg text-white">C</ButtonText>
              </Button>
            </HStack>
          </VStack>

          {/* Submit Button */}
          <Button
            onPress={handlePinSubmit}
            disabled={pin.length < 4 || isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <ButtonText className="text-white">{isLoading ? 'Verifying...' : 'Enter'}</ButtonText>
          </Button>

          {/* Back Button */}
          <Button onPress={handleBack} variant="outline" className="border-stone-700" disabled={isLoading}>
            <ButtonText className="text-stone-400">Back</ButtonText>
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
