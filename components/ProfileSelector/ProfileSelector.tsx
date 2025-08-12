import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { Profile } from '@/types/profile';

interface ProfileSelectorProps {
  profiles: Profile[];
  onProfileSelect: (profile: Profile) => void;
}

interface ProfileCardProps {
  profile: Profile;
  onPress: () => void;
}

const ProfileCard = ({ profile, onPress }: ProfileCardProps) => {
  return (
    <Pressable
      className="bg-white rounded-3xl p-6 m-3 shadow-lg border border-gray-100 active:scale-95"
      onPress={onPress}
    >
      <VStack className="items-center space-y-4">
        <Box className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center">
          <Text className="text-4xl">{profile.icon}</Text>
        </Box>
        <VStack className="items-center space-y-2">
          <Text className="text-xl font-bold text-gray-800 text-center">{profile.name}</Text>
          <Text className="text-sm text-gray-600 text-center">{profile.apps.length} educational apps</Text>
        </VStack>
        <HStack className="flex-wrap justify-center space-x-1">
          {profile.apps.slice(0, 4).map((app) => (
            <Text key={app.id} className="text-lg">
              {app.icon}
            </Text>
          ))}
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default function ProfileSelector({ profiles, onProfileSelect }: ProfileSelectorProps) {
  return (
    <Box className="flex-1 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      <VStack className="flex-1 justify-center px-6">
        {/* Header */}
        <VStack className="items-center mb-8">
          <Text className="text-white text-4xl font-bold mb-2">Welcome! 👋</Text>
          <Text className="text-white text-lg text-center opacity-90">Choose your learning adventure</Text>
        </VStack>

        {/* Profile Cards */}
        <VStack className="space-y-2">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onPress={() => onProfileSelect(profile)} />
          ))}
        </VStack>

        {/* Footer */}
        <Box className="mt-8 items-center">
          <Text className="text-white text-sm opacity-75 text-center">Safe • Educational • Fun</Text>
        </Box>
      </VStack>
    </Box>
  );
}
