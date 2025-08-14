import { formatDistanceStrict } from 'date-fns';
import { Link } from 'expo-router';
import DottedPattern from '@/components/DottedPattern';
import { Avatar } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { AddIcon, EditIcon, PlayIcon } from '@/components/ui/icon';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useAllProfiles from '@/hooks/useProfiles';

export default function Kids() {
  const profiles = useAllProfiles();

  return (
    <SafeAreaView className="bg-stone-900 flex-1">
      <Box className="flex-1 border-b-4 border-stone-700">
        <Box className="bg-stone-900 border-b-4 border-stone-700 p-4" style={{ zIndex: 1 }}>
          <Heading size="4xl">Kids</Heading>
          <Link href="/kids/new" asChild>
            <Button action="positive" className="rounded-full h-20 w-20 absolute right-4 top-[20px]">
              <ButtonIcon as={AddIcon} width={30} height={30} color="black" />
            </Button>
          </Link>
        </Box>
        <DottedPattern />

        {Object.keys(profiles).length > 0 ? (
          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {Object.values(profiles).map((profile) => (
              <HStack
                key={profile.name}
                className="m-3 items-center bg-stone-800 border-2 border-stone-700 rounded-lg shadow-md"
              >
                <Avatar className={`m-3 bg-pink-400 bg-green-400 bg-blue-400 bg-purple-400 bg-${profile.color}-400`}>
                  <Text size="2xl">{profile.emoji}</Text>
                </Avatar>
                <VStack className="flex-1 py-4">
                  <Heading className="font-bold text-xl">{profile.name}</Heading>
                  <Text>{formatDistanceStrict(profile.dob, new Date())} old</Text>
                </VStack>
                <HStack>
                  <Link href={`/kids/${profile.name}/edit`} asChild>
                    <Button variant="link" className="p-4 h-full">
                      <ButtonIcon as={EditIcon} width={32} height={32} color="white" />
                    </Button>
                  </Link>
                </HStack>
              </HStack>
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
