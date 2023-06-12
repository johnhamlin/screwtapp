import { StatusBar } from 'expo-status-bar';
import { store } from '../model/redux/store';
import { Provider } from 'react-redux';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
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
// const COLLECTION_URL =
//   'https://archive.org/services/search/v1/scrape?fields=title,date,identifier,downloads,creator&q=collection:dj-screw-discography';
const THUMB_URL = 'https://archive.org/services/img/';
// ctrl-cmd-z to open menu in simulator

export default function App() {
  // const [data, setData] = useState<Mixtape[]>();

  // // Fetch the list of mixtapes upon load
  // useEffect(() => {
  //   fetch(COLLECTION_URL)
  //     .then(response => response.json())
  //     .then(data => {
  //       setData(data.items);
  //     });

  //   return () => {
  //     // second
  //   };
  // }, []);
  const { data } = useGetMixtapeListQuery('');
  console.log(data);

  return (
    <NativeBaseProvider>
      {/* <Box flex={1} bg="#fff" alignItems="center" justifyContent="center"> */}
      <Box>
        <FlatList
          data={data?.items}
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
      </Box>
    </NativeBaseProvider>
  );
}
