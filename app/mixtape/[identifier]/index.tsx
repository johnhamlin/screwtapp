import { NativeBaseProvider, Text, Box, Button } from 'native-base';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useGetMixtapeMetadataQuery } from '../../../model/redux/services/mixtapeList';

export default function MixtapeDetails() {
  const router = useRouter();
  const { identifier } = useLocalSearchParams();
  const { data } = useGetMixtapeMetadataQuery(identifier as string);

  return (
    <NativeBaseProvider>
      <Box
        flex={1}
        bg="#fff"
        alignItems="center"
        justifyContent="center"
        safeArea
      >
        <Text fontSize={50}>BUMP</Text>

        <Button onPress={() => router.push('/')}>Home</Button>

        <Link href={'/'}>Home</Link>
        <Text>{identifier}</Text>
        <Text>{JSON.stringify(data)}</Text>
      </Box>
    </NativeBaseProvider>
  );
}
