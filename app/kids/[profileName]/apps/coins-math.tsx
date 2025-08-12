import { Redirect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native';
import DottedPattern from '@/components/DottedPattern';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useProfileByName } from '@/hooks/useProfiles';

export default function CoinsMath() {
  const { profileName } = useLocalSearchParams();
  const profile = useProfileByName(profileName as string);

  if (!profile || !profile.appConfig['coins-math']?.visible) {
    return <Redirect href="/" />;
  }

  const appConfig = profile.appConfig['coins-math'];

  return (
    <SafeAreaView className="bg-stone-900 flex-1">
      <Box className="flex-1 border-y-4 border-stone-700">
        <DottedPattern />
        <Text>Placeholder</Text>
      </Box>
    </SafeAreaView>
  );
}
