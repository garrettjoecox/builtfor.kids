import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { CoinsMathConfig } from '@/types/app';

interface CoinsMathConfigFormProps {
  config: CoinsMathConfig;
  onConfigChange: (config: CoinsMathConfig) => void;
}

export function CoinsMathConfigForm({ config, onConfigChange }: CoinsMathConfigFormProps) {
  const updateConfig = (updates: Partial<CoinsMathConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <VStack className="space-y-4 p-4 bg-stone-800 rounded-lg border border-stone-600">
      {/* Range Settings */}
      <VStack className="space-y-2">
        <Text className="text-sm font-semibold">Range Settings</Text>
        <HStack className="space-x-4">
          <VStack className="flex-1 space-y-1">
            <Text size="sm" className="text-gray-400">Lower Bound</Text>
            <Input variant="outline" size="sm">
              <InputField
                value={config.lowerBound.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value) || 0;
                  updateConfig({ lowerBound: Math.max(0, num) });
                }}
                keyboardType="numeric"
                placeholder="6"
              />
            </Input>
          </VStack>
          <VStack className="flex-1 space-y-1">
            <Text size="sm" className="text-gray-400">Upper Bound</Text>
            <Input variant="outline" size="sm">
              <InputField
                value={config.upperBound.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value) || 1;
                  updateConfig({ upperBound: Math.max(1, num) });
                }}
                keyboardType="numeric"
                placeholder="200"
              />
            </Input>
          </VStack>
        </HStack>
      </VStack>

      {/* Display Options */}
      <VStack className="space-y-3">
        <Text className="text-sm font-semibold">Display Options</Text>
        
        <HStack className="justify-between items-center">
          <Text size="sm">Display Coin Name</Text>
          <Switch
            value={config.displayCoinName}
            onValueChange={(value) => updateConfig({ displayCoinName: value })}
            size="sm"
          />
        </HStack>

        <HStack className="justify-between items-center">
          <Text size="sm">Display Coin Value</Text>
          <Switch
            value={config.displayCoinValue}
            onValueChange={(value) => updateConfig({ displayCoinValue: value })}
            size="sm"
          />
        </HStack>

        <HStack className="justify-between items-center">
          <Text size="sm">Show Amount When Wrong</Text>
          <Switch
            value={config.displayAmountWhenWrong}
            onValueChange={(value) => updateConfig({ displayAmountWhenWrong: value })}
            size="sm"
          />
        </HStack>
      </VStack>

      {/* Progress Settings */}
      <VStack className="space-y-3">
        <Text className="text-sm font-semibold">Progress Settings</Text>
        
        <HStack className="justify-between items-center">
          <Text size="sm">Show Progress Bar</Text>
          <Switch
            value={config.showProgressBar}
            onValueChange={(value) => updateConfig({ showProgressBar: value })}
            size="sm"
          />
        </HStack>

        {config.showProgressBar && (
          <VStack className="space-y-1">
            <Text size="sm" className="text-gray-400">Progress Per Answer (%)</Text>
            <Input variant="outline" size="sm">
              <InputField
                value={config.progressPerAnswer.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value) || 1;
                  updateConfig({ progressPerAnswer: Math.max(1, Math.min(100, num)) });
                }}
                keyboardType="numeric"
                placeholder="10"
              />
            </Input>
          </VStack>
        )}
      </VStack>

      {/* Other Settings */}
      <VStack className="space-y-3">
        <Text className="text-sm font-semibold">Other Settings</Text>
        
        <HStack className="justify-between items-center">
          <VStack className="flex-1">
            <Text size="sm">Prevent Overuse</Text>
            <Text size="xs" className="text-gray-400">Limit session time to prevent addiction</Text>
          </VStack>
          <Switch
            value={config.preventOveruse}
            onValueChange={(value) => updateConfig({ preventOveruse: value })}
            size="sm"
          />
        </HStack>
      </VStack>
    </VStack>
  );
}