import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import DottedPattern from '@/components/DottedPattern';
import { Avatar } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { APPS } from '@/constants/Apps';
import { useProfileByName } from '@/hooks/useProfiles';

export default function HomeScreen() {
  const { profileName } = useLocalSearchParams();
  const profile = useProfileByName(profileName as string);

  // biome-ignore lint/correctness/useExhaustiveDependencies: profileName is primitive and more reliable than profile
  const visibleApps = useMemo(() => {
    if (!profile) return [];

    return Object.values(APPS).filter(
      (app) => app.id in profile.appConfig && profile.appConfig[app.id as keyof typeof profile.appConfig]?.visible,
    );
  }, [profileName]);

  if (!profile) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView className="bg-stone-900 flex-1">
      <Box className="flex-1 border-b-4 border-stone-700">
        <HStack className="bg-stone-900 border-b-4 border-stone-700 p-4 items-center" style={{ zIndex: 1 }}>
          <VStack className="flex-1">
            <Text size="xl" className="text-white italic mb-2 text-stone-400">
              Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},
            </Text>
            <Heading size="4xl">{profile.name}!</Heading>
          </VStack>
          <Link href="/">
            <Avatar
              size="lg"
              className={`m-3 bg-pink-400 bg-yellow-400 bg-orange-400 bg-green-400 bg-blue-400 bg-purple-400 bg-${profile.color}-400`}
            >
              <Text size="3xl">{profile.emoji}</Text>
            </Avatar>
          </Link>
        </HStack>
        <DottedPattern />

        {visibleApps.length > 0 ? (
          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {visibleApps.map((app) => (
              <Link
                key={app.id}
                className="m-3"
                href={{
                  pathname: '/kids/[profileName]/apps/[appId]',
                  params: { profileName: profile.name, appId: app.id },
                }}
              >
                <HStack
                  key={app.id}
                  className="items-center bg-stone-800 border-2 border-stone-700 rounded-lg shadow-md"
                >
                  <Avatar className={`m-3 bg-pink-400 bg-green-400 bg-blue-400 bg-purple-400 bg-${app.color}-400`}>
                    <Text size="2xl">{app.emoji}</Text>
                  </Avatar>
                  <VStack className="flex-1 py-4">
                    <Heading className="font-bold text-xl">{app.name}</Heading>
                  </VStack>
                </HStack>
              </Link>
            ))}
          </ScrollView>
        ) : (
          <Center className="flex-1">
            <VStack className="bg-stone-800 border-2 border-stone-700 rounded-lg p-6 items-center">
              <Heading className="font-bold text-2xl">No Profiles</Heading>
              <Text className="p-4">Press the plus button to add a profile.</Text>
            </VStack>
          </Center>
        )}
      </Box>
    </SafeAreaView>
  );
}
