import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { DEFAULT_APP_CONFIG } from '@/constants/Apps';
import { addProfile } from '@/hooks/useProfiles';

const COLOR_OPTIONS = [
  { name: 'Pink', value: 'pink', bgColor: '#EC4899', textColor: '#FFFFFF' },
  { name: 'Yellow', value: 'yellow', bgColor: '#EAB308', textColor: '#000000' },
  { name: 'Orange', value: 'orange', bgColor: '#F97316', textColor: '#FFFFFF' },
  { name: 'Green', value: 'green', bgColor: '#22C55E', textColor: '#FFFFFF' },
  { name: 'Blue', value: 'blue', bgColor: '#3B82F6', textColor: '#FFFFFF' },
  { name: 'Purple', value: 'purple', bgColor: '#A855F7', textColor: '#FFFFFF' },
];

export default function NewProfileScreen() {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedEmoji, setSelectedEmoji] = useState('👶');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    if (!selectedEmoji.trim()) {
      Alert.alert('Error', 'Please select an emoji');
      return;
    }

    if (!dateOfBirth) {
      Alert.alert('Error', 'Please enter a date of birth');
      return;
    }

    const profileData = {
      name: name.trim(),
      color: selectedColor,
      emoji: selectedEmoji.trim(),
      dob: new Date(dateOfBirth),
      appConfig: DEFAULT_APP_CONFIG,
    };

    addProfile(profileData);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="bg-stone-900 flex-1">
      <ScrollView className="flex-1">
        <Box className="p-6">
          <Heading size="3xl" className="mb-6">
            Create Profile
          </Heading>

          <VStack className="space-y-6">
            {/* Name Input */}
            <VStack className="space-y-2">
              <Text className="text-lg font-semibold">Name</Text>
              <Input variant="outline" size="lg">
                <InputField placeholder="Enter name" value={name} onChangeText={setName} />
              </Input>
            </VStack>

            {/* Date of Birth Input */}
            <VStack className="space-y-2">
              <Text className="text-lg font-semibold">Date of Birth</Text>
              <Input variant="outline" size="lg">
                <InputField
                  placeholder="YYYY-MM-DD"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  keyboardType="numeric"
                />
              </Input>
              <Text size="sm" className="text-gray-400">
                Format: YYYY-MM-DD (e.g., 2015-03-15)
              </Text>
            </VStack>

            {/* Color Selection */}
            <VStack className="space-y-2">
              <Text className="text-lg font-semibold">Color</Text>
              <HStack className="flex-wrap gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <Button
                    key={color.value}
                    variant={selectedColor === color.value ? 'solid' : 'outline'}
                    size="md"
                    className="px-4 py-2 min-w-20"
                    style={{
                      backgroundColor: selectedColor === color.value ? color.bgColor : 'transparent',
                      borderColor: color.bgColor,
                      borderWidth: 2,
                    }}
                    onPress={() => setSelectedColor(color.value)}
                  >
                    <ButtonText
                      style={{
                        color: selectedColor === color.value ? color.textColor : color.bgColor,
                        fontWeight: '600',
                      }}
                    >
                      {color.name}
                    </ButtonText>
                  </Button>
                ))}
              </HStack>
            </VStack>

            {/* Emoji Selection */}
            <VStack className="space-y-2">
              <Text className="text-lg font-semibold">Emoji</Text>
              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Tap to select an emoji 😊"
                  value={selectedEmoji}
                  onChangeText={setSelectedEmoji}
                  style={{ fontSize: 18 }}
                />
              </Input>
              <Text size="sm" className="text-gray-400">
                Tap in the field above and use your device's emoji keyboard
              </Text>
            </VStack>

            {/* Action Buttons */}
            <VStack className="space-y-3 mt-8">
              <Button onPress={handleSave} action="positive" size="lg">
                <ButtonText>Create Profile</ButtonText>
              </Button>

              <Button onPress={handleCancel} variant="outline" size="lg">
                <ButtonText>Cancel</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
}
