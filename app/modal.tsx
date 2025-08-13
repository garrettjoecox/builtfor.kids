import { router, useLocalSearchParams } from 'expo-router';
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
import { addProfile, deleteProfile, updateProfile, useProfileByName } from '@/hooks/useProfiles';

const COLOR_OPTIONS = [
  { name: 'Pink', value: 'pink' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Orange', value: 'orange' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Purple', value: 'purple' },
];

const EMOJI_OPTIONS = ['👶', '👧', '👦', '👨', '👩', '🧒', '👨‍💻', '👩‍💻', '🎨', '🎭', '🎯', '⚽'];

export default function ProfileModalScreen() {
  const { mode, profileName } = useLocalSearchParams();
  const isEdit = mode === 'edit';
  const existingProfile = useProfileByName(profileName as string);

  const [name, setName] = useState(isEdit ? existingProfile?.name || '' : '');
  const [selectedColor, setSelectedColor] = useState(isEdit ? existingProfile?.color || 'blue' : 'blue');
  const [selectedEmoji, setSelectedEmoji] = useState(isEdit ? existingProfile?.emoji || '👶' : '👶');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    const profileData = {
      name: name.trim(),
      color: selectedColor,
      emoji: selectedEmoji,
      dob: isEdit ? existingProfile?.dob || new Date() : new Date(),
      appConfig: isEdit ? existingProfile?.appConfig || DEFAULT_APP_CONFIG : DEFAULT_APP_CONFIG,
    };

    if (isEdit && existingProfile) {
      updateProfile(existingProfile.name, profileData);
    } else {
      addProfile(profileData);
    }

    router.back();
  };

  const handleDelete = () => {
    if (!existingProfile) return;

    Alert.alert('Delete Profile', `Are you sure you want to delete ${existingProfile.name}'s profile?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProfile(existingProfile.name);
          router.back();
        },
      },
    ]);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="bg-stone-900 flex-1">
      <ScrollView className="flex-1">
        <Box className="p-6">
          <Heading size="3xl" className="mb-6">
            {isEdit ? 'Edit Profile' : 'Create Profile'}
          </Heading>

          <VStack className="space-y-6">
            {/* Name Input */}
            <VStack className="space-y-2">
              <Text className="text-lg font-semibold">Name</Text>
              <Input variant="outline" size="lg">
                <InputField placeholder="Enter name" value={name} onChangeText={setName} />
              </Input>
            </VStack>

            {/* Color Selection */}
            <VStack className="space-y-2">
              <Text className="text-lg font-semibold">Color</Text>
              <HStack className="flex-wrap gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <Button
                    key={color.value}
                    variant={selectedColor === color.value ? 'solid' : 'outline'}
                    action={selectedColor === color.value ? 'primary' : 'secondary'}
                    size="sm"
                    className={`bg-${color.value}-400 border-${color.value}-400`}
                    onPress={() => setSelectedColor(color.value)}
                  >
                    <ButtonText>{color.name}</ButtonText>
                  </Button>
                ))}
              </HStack>
            </VStack>

            {/* Emoji Selection */}
            <VStack className="space-y-2">
              <Text className="text-lg font-semibold">Emoji</Text>
              <HStack className="flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <Button
                    key={emoji}
                    variant={selectedEmoji === emoji ? 'solid' : 'outline'}
                    action={selectedEmoji === emoji ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-16 h-16"
                    onPress={() => setSelectedEmoji(emoji)}
                  >
                    <Text size="2xl">{emoji}</Text>
                  </Button>
                ))}
              </HStack>
            </VStack>

            {/* Action Buttons */}
            <VStack className="space-y-3 mt-8">
              <Button onPress={handleSave} action="positive" size="lg">
                <ButtonText>{isEdit ? 'Save Changes' : 'Create Profile'}</ButtonText>
              </Button>

              <Button onPress={handleCancel} variant="outline" size="lg">
                <ButtonText>Cancel</ButtonText>
              </Button>

              {isEdit && (
                <Button onPress={handleDelete} action="negative" size="lg">
                  <ButtonText>Delete Profile</ButtonText>
                </Button>
              )}
            </VStack>
          </VStack>
        </Box>
      </ScrollView>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
}
