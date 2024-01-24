import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link } from 'expo-router';
import { FlatList, Image } from 'react-native';
import { Button, Divider, List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetMixtapeListQuery } from '../model/redux/services/mixtapeList';

dayjs.extend(utc);

const THUMB_URL = 'https://archive.org/services/img/';
// ctrl-cmd-z to open menu in simulator

export default function App() {
  const { data, error, isLoading } = useGetMixtapeListQuery('');

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      {error ? (
        <Text>Oh no! Error</Text>
      ) : isLoading ? (
        <Text>Loading…</Text>
      ) : data ? (
        <FlatList
          // Load more on initial render so it fills the screen
          initialNumToRender={20}
          keyExtractor={item => item.identifier}
          data={data}
          style={{ paddingHorizontal: 16, width: '100%' }}
          renderItem={({ item: mixtape }: { item: Mixtape }) => (
            <>
              <Link
                // @ts-ignore this is a bug in expo-router
                href={{
                  pathname: 'mixtape/[identifier]',
                  params: { identifier: mixtape.identifier },
                }}
              >
                <List.Item
                  title={mixtape.title}
                  right={() => (
                    <Text style={{ marginLeft: 'auto' }}>
                      {dayjs(mixtape.date).format('YYYY')}
                    </Text>
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
    </SafeAreaView>
  );
}
