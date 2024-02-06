import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';

import { useGetMixtapeListQuery } from '@/features/mixtapeList/slices/mixtapeListApi';
import { listStyles } from '@/styles';

dayjs.extend(utc);

const THUMB_URL = 'https://archive.org/services/img/';
// ctrl-cmd-z to open menu in simulator
// console.log(reduxStorage.getAllKeys());
// console.log(reduxStorage.getItem('persist:root'));

export default function Home() {
  const { data, error, isLoading } = useGetMixtapeListQuery('');

  return (
    <>
      <Stack.Screen
        options={{
          title: 'ScrewTapp',
        }}
      />
      <View style={listStyles.container}>
        {error ? (
          <View style={listStyles.errorContainer}>
            <Text>Oh no! Error</Text>
          </View>
        ) : isLoading ? (
          <View style={listStyles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : data ? (
          <FlashList
            // Load more on initial render so it fills the screen
            // initialNumToRender={20}
            estimatedItemSize={84}
            keyExtractor={item => item.identifier}
            data={data}
            renderItem={({ item: mixtape }: { item: Mixtape }) => (
              <>
                <Link
                  //prevent Link from wrapping children in a <Text> component
                  asChild
                  //@ts-ignore weird expo-router bug?
                  href={{
                    pathname: 'mixtape/[identifier]',
                    params: { identifier: mixtape.identifier },
                  }}
                  // onPress={}
                >
                  <List.Item
                    // word wrap for Title
                    style={listStyles.item}
                    titleNumberOfLines={2}
                    title={mixtape.title}
                    titleStyle={listStyles.title}
                    right={() => (
                      <Text>{dayjs(mixtape.date).format('YYYY')}</Text>
                    )}
                    left={() => (
                      <Image
                        style={listStyles.albumThumbnail}
                        alt="album artwork"
                        source={{
                          uri: THUMB_URL + mixtape.identifier,
                        }}
                      />
                    )}
                  />
                </Link>
                <Divider />
              </>
            )}
          />
        ) : null}
      </View>
    </>
  );
}
