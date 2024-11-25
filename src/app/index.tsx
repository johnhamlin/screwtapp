import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';

import {
  mixtapeListApi,
  useGetMixtapeListQuery,
} from '@/features/mixtapeList/slices/mixtapeListApi';
import { selectIsFooterPlayerVisible } from '@/features/player/slice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { listStyles } from '@/styles';

dayjs.extend(utc);

export default function Home() {
  const {
    data: mixtapeListData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetMixtapeListQuery('');
  const dispatch = useAppDispatch();
  const isFooterPlayerVisible = useAppSelector(selectIsFooterPlayerVisible);

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
              refetch();
            }}
            ListFooterComponent={() =>
              isFooterPlayerVisible && <View style={{ height: 102 }} />
            }
            refreshing={isFetching}
            renderItem={({ item: mixtape }: { item: Mixtape }) => (
              <>
                <Link
                  //prevent Link from wrapping children in a <Text> component
                  asChild
                  href={{
                    pathname: '/mixtape/[id]',
                    params: { id: mixtape.id },
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
