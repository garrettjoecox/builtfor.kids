import type { AppConfig } from '@/types/app';

export interface Profile {
  name: string;
  dob: Date;
  color: string; // Hex color code
  emoji: string;
  appConfig: AppConfig;
}
