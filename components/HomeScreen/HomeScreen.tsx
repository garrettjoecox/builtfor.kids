import { useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { App, Profile } from '@/types/profile';

interface HomeScreenProps {
  profile: Profile;
  onBackToProfiles: () => void;
}

interface AppIconProps {
  app: App;
  onPress: () => void;
}

const AppIcon = ({ app, onPress }: AppIconProps) => {
  return (
    <Pressable
      className="w-16 h-16 md:w-20 md:h-20 m-2 rounded-2xl justify-center items-center shadow-lg"
      style={{ backgroundColor: '#007AFF' }} // iOS blue default
      onPress={onPress}
    >
      <Text className="text-2xl md:text-3xl">{app.icon}</Text>
      <Text className="text-white text-xs md:text-sm font-medium text-center mt-1 px-1" numberOfLines={1}>
        {app.name}
      </Text>
    </Pressable>
  );
};

const DockIcon = ({ app, onPress }: AppIconProps) => {
  return (
    <Pressable
      className="w-14 h-14 md:w-16 md:h-16 mx-1 rounded-2xl justify-center items-center"
      style={{ backgroundColor: '#007AFF' }}
      onPress={onPress}
    >
      <Text className="text-xl md:text-2xl">{app.icon}</Text>
    </Pressable>
  );
};

export default function HomeScreen({ profile, onBackToProfiles }: HomeScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  });

  const handleAppPress = (app: App) => {
    Alert.alert(app.name, `Welcome to ${app.name}! This app is designed for ${profile.name.toLowerCase()}.`, [
      { text: 'OK' },
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Split apps into main screen apps and dock apps
  const mainApps = profile.apps.slice(0, -2);
  const dockApps = profile.apps.slice(-2);

  return (
    <Box className="flex-1 bg-gradient-to-b from-blue-400 to-blue-600">
      <StatusBar barStyle="light-content" />

      {/* Status Bar Area */}
      <Box className="pt-12 px-6">
        <HStack className="justify-between items-center">
          <Text className="text-white text-sm font-medium">{formatTime(currentTime)}</Text>
          <Text className="text-white text-sm font-medium">100% 🔋</Text>
        </HStack>
      </Box>

      {/* Date and Profile Info */}
      <Box className="px-6 pt-4">
        <Text className="text-white text-lg font-light">{formatDate(currentTime)}</Text>
        <Text className="text-white text-2xl font-bold mt-1">
          {profile.name} Mode {profile.icon}
        </Text>
      </Box>

      {/* Main App Grid */}
      <VStack className="flex-1 justify-center px-6">
        <Box className="flex-row flex-wrap justify-center">
          {mainApps.map((app) => (
            <AppIcon key={app.id} app={app} onPress={() => handleAppPress(app)} />
          ))}
        </Box>
      </VStack>

      {/* Dock */}
      <Box className="pb-8 px-6">
        <Box className="bg-white/20 rounded-3xl py-3 mx-4 mb-4" style={{ backdropFilter: 'blur(20px)' }}>
          <HStack className="justify-center items-center">
            {dockApps.map((app) => (
              <DockIcon key={app.id} app={app} onPress={() => handleAppPress(app)} />
            ))}
          </HStack>
        </Box>

        {/* Back to profiles button */}
        <Button className="bg-white/20 rounded-2xl mx-4" onPress={onBackToProfiles}>
          <ButtonText className="text-white font-medium">Switch Profile</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
