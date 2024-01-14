import { useGetMixtapeListQuery } from '../model/redux/services/mixtapeList';
import { Link } from 'expo-router';
import {
  Avatar,
  Box,
  Button,
  FlatList,
  Heading,
  HStack,
  Image,
  NativeBaseProvider,
  Spacer,
  Text,
  View,
  VStack,
} from 'native-base';

const THUMB_URL = 'https://archive.org/services/img/';
// ctrl-cmd-z to open menu in simulator

export default function App() {
  const { data, error, isLoading } = useGetMixtapeListQuery('');

  return (
    <Box
      flex={1}
      alignItems={'center'}
      justifyContent={'center'}
      safeAreaTop
      safeAreaX
    >
      {error ? (
        <Text>Oh no! Error</Text>
      ) : isLoading ? (
        <Text>Loading…</Text>
      ) : data ? (
        <FlatList
          // Load more on initial render so it fills the screen
          initialNumToRender={20}
          data={data}
          renderItem={({ item }: { item: Mixtape }) => (
            <Link href={'/mixtape/' + item.identifier}>
              <Box
                borderBottomWidth="1"
                _dark={{
                  borderColor: 'muted.50',
                }}
                borderColor="muted.800"
                pl={['0', '4']}
                pr={['0', '5']}
                py="2"
              >
                <HStack space={[2, 3]} justifyContent="space-between">
                  <Image
                    size="48px"
                    alt="album artwork"
                    source={{
                      uri: THUMB_URL + item.identifier,
                    }}
                  />

                  <VStack>
                    <Text
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      bold
                      width={'75%'}
                    >
                      {item.title}
                    </Text>
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: 'warmGray.200',
                      }}
                    >
                      {item.downloads}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Text
                    fontSize="xs"
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800"
                    alignSelf="flex-start"
                  >
                    {item.date}
                  </Text>
                </HStack>
              </Box>
            </Link>
          )}
          keyExtractor={(item: Mixtape) => item.identifier}
        />
      ) : null}
    </Box>
  );
}
