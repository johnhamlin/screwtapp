import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Box,
  Button,
  FlatList,
  HStack,
  Image,
  NativeBaseProvider,
  Pressable,
  ScrollView,
  Spacer,
  Text,
  VStack,
} from 'native-base';

import { useGetMixtapeQuery } from '../../../model/redux/services/mixtapeList';
import Player from '../../components/audio/Player';
import { useState } from 'react';

export default function MixtapeDetails() {
  const router = useRouter();
  const { identifier } = useLocalSearchParams();
  const { data } = useGetMixtapeQuery(identifier as string);
  const [playerProps, setPlayerProps] = useState<PlayerProps>({
    dir: null,
    file: null,
  });

  const setTrackPlaying = ({ dir, file }: PlayerProps) => {
    setPlayerProps({ dir, file });
  };

  return (
    <Box
      flex={1}
      bg="#fff"
      alignItems="center"
      justifyContent="center"
      safeArea
      safeAreaX
    >
      <Button onPress={() => router.push('/')}>Home</Button>

      <Link href={'/'}>Home</Link>

      <Player {...playerProps}></Player>

      <FlatList
        data={data}
        renderItem={({ item }: { item: Track }) => (
          // TODO: Wrap this in a link
          <Pressable
            onPress={() => setTrackPlaying({ dir: item.dir, file: item.name })}
          >
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
                {/* <Image
                    size="48px"
                    alt="album artwork"
                    source={{
                      uri: THUMB_URL + item.identifier,
                    }}
                  /> */}

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
                    {dayjs.utc(item.length * 1000).format('m:ss')}
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
                  {item.track}
                </Text>
              </HStack>
            </Box>
          </Pressable>
        )}
        keyExtractor={(item: Track) => item.md5}
      />
    </Box>
  );
}
dayjs;
