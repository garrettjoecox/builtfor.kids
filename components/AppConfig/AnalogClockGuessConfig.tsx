import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { AnalogClockGuessConfig } from '@/types/app';

interface AnalogClockGuessConfigFormProps {
  config: AnalogClockGuessConfig;
  onConfigChange: (config: AnalogClockGuessConfig) => void;
}

const GRANULARITY_OPTIONS = [
  { label: 'Hour', value: 'hour' },
  { label: '30 Min', value: '30-minutes' },
  { label: '15 Min', value: '15-minutes' },
  { label: '5 Min', value: '5-minutes' },
  { label: '1 Min', value: '1-minute' },
] as const;

export function AnalogClockGuessConfigForm({ config, onConfigChange }: AnalogClockGuessConfigFormProps) {
  const updateConfig = (updates: Partial<AnalogClockGuessConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <VStack className="space-y-4 p-4 bg-stone-800 rounded-lg border border-stone-600">
      {/* Difficulty Settings */}
      <VStack className="space-y-2">
        <Text className="text-sm font-semibold">Difficulty Settings</Text>
        <VStack className="space-y-2">
          <Text size="sm" className="text-gray-400">
            Time Granularity
          </Text>
          <HStack className="flex-wrap gap-2">
            {GRANULARITY_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={config.granularity === option.value ? 'solid' : 'outline'}
                size="sm"
                className="px-3 py-1"
                onPress={() => updateConfig({ granularity: option.value as AnalogClockGuessConfig['granularity'] })}
              >
                <ButtonText size="sm">{option.label}</ButtonText>
              </Button>
            ))}
          </HStack>
          <Text size="xs" className="text-gray-400">
            Determines how precise the time readings need to be
          </Text>
        </VStack>
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
            <Text size="sm" className="text-gray-400">
              Progress Per Answer (%)
            </Text>
            <Input variant="outline" size="sm">
              <InputField
                value={config.progressPerAnswer.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value, 10) || 1;
                  updateConfig({ progressPerAnswer: Math.max(1, Math.min(100, num)) });
                }}
                keyboardType="numeric"
                placeholder="10"
              />
            </Input>
            <Text size="xs" className="text-gray-400">
              How much progress is gained for each correct answer
            </Text>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}
