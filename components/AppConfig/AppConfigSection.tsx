import { Avatar } from '@/components/ui/avatar';
import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { AnalogClockGuessConfig, AppConfig, BaseAppConfig, CoinsCountConfig, CoinsMathConfig } from '@/types/app';
import { AnalogClockGuessConfigForm } from './AnalogClockGuessConfig';
import { CoinsCountConfigForm } from './CoinsCountConfig';
import { CoinsMathConfigForm } from './CoinsMathConfig';

interface AppConfigSectionProps {
  appId: keyof AppConfig;
  appName: string;
  appEmoji: string;
  appColor: string;
  config: BaseAppConfig;
  onConfigChange: (config: BaseAppConfig) => void;
}

export function AppConfigSection({
  appId,
  appName,
  appEmoji,
  appColor,
  config,
  onConfigChange,
}: AppConfigSectionProps) {
  const updateVisibility = (visible: boolean) => {
    onConfigChange({ ...config, visible });
  };

  const renderAppSpecificConfig = () => {
    if (!config.visible) return null;

    switch (appId) {
      case 'coins-math':
        return (
          <CoinsMathConfigForm
            config={config as CoinsMathConfig}
            onConfigChange={onConfigChange as (config: CoinsMathConfig) => void}
          />
        );
      case 'coins-count':
        return (
          <CoinsCountConfigForm
            config={config as CoinsCountConfig}
            onConfigChange={onConfigChange as (config: CoinsCountConfig) => void}
          />
        );
      case 'analog-clock-guess':
        return (
          <AnalogClockGuessConfigForm
            config={config as AnalogClockGuessConfig}
            onConfigChange={onConfigChange as (config: AnalogClockGuessConfig) => void}
          />
        );
      // Future app configs can be added here
      // case 'paint':
      //   return <PaintConfigForm config={config} onConfigChange={onConfigChange} />;
      default:
        return (
          <VStack className="p-4 bg-stone-800 rounded-lg border border-stone-600">
            <Text size="sm" className="text-gray-400">
              No additional settings available for this app.
            </Text>
          </VStack>
        );
    }
  };

  return (
    <VStack className="space-y-3">
      {/* App Header with Visibility Toggle */}
      <HStack className="justify-between items-center p-3 bg-stone-700 rounded-lg border border-stone-600">
        <HStack className="items-center space-x-3">
          <Avatar className={`bg-${appColor}-400`} size="md">
            <Text size="lg">{appEmoji}</Text>
          </Avatar>
          <VStack>
            <Text className="font-semibold">{appName}</Text>
            <Text size="sm" className="text-gray-400">
              {config.visible ? 'Visible to child' : 'Hidden from child'}
            </Text>
          </VStack>
        </HStack>
        <Switch value={config.visible} onValueChange={updateVisibility} size="md" />
      </HStack>

      {/* App-Specific Configuration */}
      {renderAppSpecificConfig()}
    </VStack>
  );
}
