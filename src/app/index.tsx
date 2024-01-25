import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link, Stack } from 'expo-router';
import { FlatList, Image, View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';

import { useGetMixtapeListQuery } from '@/features/mixtapeList/mixtapeListSlice';

dayjs.extend(utc);

const THUMB_URL = 'https://archive.org/services/img/';
// ctrl-cmd-z to open menu in simulator

export default function App() {
  const { data, error, isLoading } = useGetMixtapeListQuery('');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack.Screen
        options={{
          title: 'ScrewTapp',
        }}
      />

      {error ? (
        <Text>Oh no! Error</Text>
      ) : isLoading ? (
        <ActivityIndicator size="large" />
      ) : data ? (
        <FlatList
          style={{ width: '100%', paddingLeft: 18 }}
          // Load more on initial render so it fills the screen
          initialNumToRender={20}
          keyExtractor={item => item.identifier}
          data={data}
          renderItem={({ item: mixtape }: { item: Mixtape }) => (
            <>
              <Link
                //prevent Link from wrapping children in a <Text> component
                asChild
                href={{
                  pathname: 'mixtape/[identifier]',
                  params: { identifier: mixtape.identifier },
                }}
              >
                <List.Item
                  // word wrap for Title
                  titleNumberOfLines={2}
                  title={mixtape.title}
                  titleStyle={{ paddingRight: 18 }}
                  right={() => (
                    <Text>{dayjs(mixtape.date).format('YYYY')}</Text>
                  )}
                  left={() => (
                    <Image
                      style={{ width: 48, height: 48 }}
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
  );
}
