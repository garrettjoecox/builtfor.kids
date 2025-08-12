import { ExternalLink } from '@/components/ExternalLink';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function About() {
  return (
    <Center className="flex-1">
      <Heading className="font-bold text-2xl">Made by Garrett</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">
        If you want to support my work, please consider buying me a coffee at{' '}
        <ExternalLink style={{ paddingVertical: 15 }} href="https://ko-fi.com/garrettcox">
          <Text className="text-center">ko-fi.com/garrettcox</Text>
        </ExternalLink>
      </Text>
    </Center>
  );
}
