import { useGetMixtapeListQuery } from '../model/redux/services/mixtapeList';
import { Link } from 'expo-router';
import { FlatList, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text } from 'react-native';

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
          renderItem={({ item: mixtape }: { item: Mixtape }) => (
            <Link href={'/mixtape/' + mixtape.identifier}>
              <List.Item
                title={mixtape.title}
                description={mixtape.date}
                left={() => (
                  <Image
                    style={{ width: 48, height: 48 }}
                    alt="album artwork"
                    source={{
                      uri: THUMB_URL + mixtape.identifier,
                    }}
                  />
                )}
              ></List.Item>
            </Link>
          )}
        />
      ) : null}
    </SafeAreaView>
  );
}
