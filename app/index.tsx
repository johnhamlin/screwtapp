import { StatusBar } from 'expo-status-bar';

import { StyleSheet, SafeAreaView } from 'react-native';
import {
  NativeBaseProvider,
  Box,
  Button,
  Heading,
  FlatList,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Text,
  View,
} from 'native-base';
import { Link } from 'expo-router';
import { useGetMixtapeListQuery } from '../model/redux/services/mixtapeList';
const THUMB_URL = 'https://archive.org/services/img/';
// ctrl-cmd-z to open menu in simulator

export default function App() {
  const { data, error, isLoading } = useGetMixtapeListQuery('');

  return (
    <Box safeAreaTop>
      {error ? (
        <Text>Oh no! Error</Text>
      ) : isLoading ? (
        <Text>Loading…</Text>
      ) : data ? (
        <FlatList
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
                  <Avatar
                    size="48px"
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
