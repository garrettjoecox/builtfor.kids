import { useState } from 'react';
import { DEFAULT_APP_CONFIG } from '@/constants/Apps';
import type { Profile } from '@/types/profile';

const PROFILES: Profile[] = [
  {
    name: 'Garrett',
    color: 'orange',
    emoji: '👨‍💻',
    dob: new Date('1996-02-16'),
    appConfig: DEFAULT_APP_CONFIG,
  },
];

export default function useAllProfiles() {
  return PROFILES.reduce((acc: Record<string, Profile>, profile) => {
    acc[profile.name] = profile;
    return acc;
  }, {});
}

export function useProfileByName(name: string | null) {
  const profiles = useAllProfiles();

  return name ? profiles[name] || null : null;
}

export function useActiveProfile() {
  const [activeProfileName, setActiveProfileName] = useState<string | null>(null);

  const activeProfile = useProfileByName(activeProfileName);

  return {
    profile: activeProfile,
    setProfile: setActiveProfileName,
  };
}
