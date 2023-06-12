import { NativeBaseProvider, Text, Box } from 'native-base';
import { Link, useLocalSearchParams } from 'expo-router';

export default function MixtapeDetails() {
  const { identifier } = useLocalSearchParams();

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text>{identifier}</Text>
        <Link href={'/'}>Home</Link>
      </Box>
    </NativeBaseProvider>
  );
}
