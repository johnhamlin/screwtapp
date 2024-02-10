import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import {
  mixtapeListApi,
  useGetMixtapeListQuery,
} from '@/features/mixtapeList/slices/mixtapeListApi';
import { listStyles } from '@/styles';

dayjs.extend(utc);

export default function Home() {
  const {
    data: mixtapeListData,
    error,
    isLoading,
    isFetching,
  } = useGetMixtapeListQuery('');
  const dispatch = useDispatch();

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
        ) : mixtapeListData ? (
          <FlashList
            // Load more on initial render so it fills the screen
            // initialNumToRender={20}
            estimatedItemSize={84}
            keyExtractor={mixtape => mixtape.id}
            data={mixtapeListData}
            onRefresh={() => {
              dispatch(mixtapeListApi.util.invalidateTags(['MixtapeList']));
            }}
            refreshing={isFetching}
            renderItem={({ item: mixtape }: { item: Mixtape }) => (
              <>
                <Link
                  //prevent Link from wrapping children in a <Text> component
                  asChild
                  //@ts-expect-error weird expo-router bug?
                  href={{
                    pathname: 'mixtape/[id]',
                    params: { identifier: mixtape.id },
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
                          uri: mixtape.thumbnail,
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
