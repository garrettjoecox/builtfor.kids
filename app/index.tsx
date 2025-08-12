import { useState } from 'react';
import HomeScreen from '@/components/HomeScreen/HomeScreen';
import ProfileSelector from '@/components/ProfileSelector/ProfileSelector';
import { Box } from '@/components/ui/box';
import { type Profile, profiles } from '@/types/profile';

export default function Home() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleBackToProfiles = () => {
    setSelectedProfile(null);
  };

  return (
    <Box className="flex-1">
      {selectedProfile ? (
        <HomeScreen profile={selectedProfile} onBackToProfiles={handleBackToProfiles} />
      ) : (
        <ProfileSelector profiles={profiles} onProfileSelect={handleProfileSelect} />
      )}
    </Box>
  );
}
