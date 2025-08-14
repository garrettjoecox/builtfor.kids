import { Link } from 'expo-router';
import DottedPattern from '@/components/DottedPattern';
import { Avatar } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useAllProfiles from '@/hooks/useProfiles';

export default function Landing() {
  const profiles = useAllProfiles();

  return (
    <SafeAreaView className="bg-stone-900 flex-1">
      <Box className="flex-1 border-y-4 border-stone-700">
        <DottedPattern />

        <ScrollView
          contentContainerStyle={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
            padding: 20,
          }}
        >
          {Object.values(profiles).map((profile) => (
            <Link
              key={profile.name}
              href={{
                pathname: '/kids/[profileName]',
                params: { profileName: profile.name },
              }}
            >
              <VStack className="w-[150px] gap-4 p-4 items-center bg-stone-800 border-2 border-stone-700 rounded-lg shadow-md">
                <Avatar
                  size="xl"
                  className={`bg-pink-400 bg-green-400 bg-blue-400 bg-purple-400 bg-${profile.color}-400`}
                >
                  <Text size="4xl">{profile.emoji}</Text>
                </Avatar>
                <VStack className="flex-1">
                  <Heading className="font-bold text-xl">{profile.name}</Heading>
                </VStack>
              </VStack>
            </Link>
          ))}
          <Link href={{ pathname: '/parents/pin' }}>
            <VStack className="w-[150px] gap-4 p-4 items-center bg-stone-800 border-2 border-stone-700 rounded-lg shadow-md">
              <Avatar size="xl" className={`bg-red-400`}>
                <Text size="4xl">⚙️</Text>
              </Avatar>
              <VStack className="flex-1">
                <Heading className="font-bold text-xl">Parents</Heading>
              </VStack>
            </VStack>
          </Link>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
