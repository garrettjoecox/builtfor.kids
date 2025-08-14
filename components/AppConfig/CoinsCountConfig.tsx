import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { CoinsCountConfig } from '@/types/app';

interface CoinsCountConfigFormProps {
  config: CoinsCountConfig;
  onConfigChange: (config: CoinsCountConfig) => void;
}

export function CoinsCountConfigForm({ config, onConfigChange }: CoinsCountConfigFormProps) {
  const updateConfig = (updates: Partial<CoinsCountConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <VStack className="space-y-4 p-4 bg-stone-800 rounded-lg border border-stone-600">
      {/* Range Settings */}
      <VStack className="space-y-2">
        <Text className="text-sm font-semibold">Range Settings</Text>
        <HStack className="space-x-4">
          <VStack className="flex-1 space-y-1">
            <Text size="sm" className="text-gray-400">
              Lower Bound
            </Text>
            <Input variant="outline" size="sm">
              <InputField
                value={config.lowerBound.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value, 10) || 1;
                  updateConfig({ lowerBound: Math.max(1, num) });
                }}
                keyboardType="numeric"
                placeholder="1"
              />
            </Input>
          </VStack>
          <VStack className="flex-1 space-y-1">
            <Text size="sm" className="text-gray-400">
              Upper Bound
            </Text>
            <Input variant="outline" size="sm">
              <InputField
                value={config.upperBound.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value, 10) || 1;
                  updateConfig({ upperBound: Math.max(config.lowerBound, num) });
                }}
                keyboardType="numeric"
                placeholder="10"
              />
            </Input>
          </VStack>
        </HStack>
      </VStack>

      {/* Help Settings */}
      <VStack className="space-y-3">
        <Text className="text-sm font-semibold">Help Settings</Text>

        <HStack className="justify-between items-center">
          <VStack className="flex-1">
            <Text size="sm">Hint Direction When Wrong</Text>
            <Text size="xs" className="text-gray-400">
              Show whether the answer should be higher or lower
            </Text>
          </VStack>
          <Switch
            value={config.hintDirectionWhenWrong}
            onValueChange={(value) => updateConfig({ hintDirectionWhenWrong: value })}
            size="sm"
          />
        </HStack>
      </VStack>
    </VStack>
  );
}
