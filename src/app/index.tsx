import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Link, Stack } from 'expo-router';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';

import { useGetMixtapeListQuery } from '@/features/mixtapeList/slices/mixtapeListApi';

dayjs.extend(utc);

const THUMB_URL = 'https://archive.org/services/img/';
// ctrl-cmd-z to open menu in simulator

export default function Home() {
  const { data, error, isLoading } = useGetMixtapeListQuery('');

  return (
    <>
      <Stack.Screen
        options={{
          title: 'ScrewTapp',
        }}
      />
      <View
        // This Nativewind style isn't working in the lattest beta
        style={styles.container}
        // className="flex items-center content-center flex-1"
      >
        {error ? (
          <Text>Oh no! Error</Text>
        ) : isLoading ? (
          <ActivityIndicator size="large" />
        ) : data ? (
          <FlatList
            className="w-full pl-5"
            // Load more on initial render so it fills the screen
            initialNumToRender={20}
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
                    titleNumberOfLines={2}
                    title={mixtape.title}
                    titleStyle={{ paddingRight: 18 }}
                    right={() => (
                      <Text>{dayjs(mixtape.date).format('YYYY')}</Text>
                    )}
                    left={() => (
                      <Image
                        className="w-14 h-14"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
