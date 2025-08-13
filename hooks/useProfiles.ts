import React, { useState } from 'react';
import { DEFAULT_APP_CONFIG } from '@/constants/Apps';
import type { Profile } from '@/types/profile';

const INITIAL_PROFILES: Profile[] = [
  {
    name: 'Garrett',
    color: 'orange',
    emoji: '👨‍💻',
    dob: new Date('1996-02-16'),
    appConfig: DEFAULT_APP_CONFIG,
  },
];

// Global state for profiles
let globalProfiles = [...INITIAL_PROFILES];
let profilesListeners: Array<() => void> = [];

export function addProfile(profile: Profile) {
  globalProfiles = [...globalProfiles, profile];
  profilesListeners.forEach((listener) => listener());
}

export function updateProfile(name: string, updatedProfile: Profile) {
  globalProfiles = globalProfiles.map((profile) => (profile.name === name ? updatedProfile : profile));
  profilesListeners.forEach((listener) => listener());
}

export function deleteProfile(name: string) {
  globalProfiles = globalProfiles.filter((profile) => profile.name !== name);
  profilesListeners.forEach((listener) => listener());
}

export default function useAllProfiles() {
  const [, forceUpdate] = useState({});

  // Subscribe to profile changes
  React.useEffect(() => {
    const rerender = () => forceUpdate({});
    profilesListeners.push(rerender);
    return () => {
      profilesListeners = profilesListeners.filter((listener) => listener !== rerender);
    };
  }, []);

  return globalProfiles.reduce((acc: Record<string, Profile>, profile) => {
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
