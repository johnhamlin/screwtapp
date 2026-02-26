import { FontAwesome } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';

import {
  PlayerControls,
  Progress,
  TrackInfo,
} from '@/features/player/components';
import LinkToActiveAlbum from '@/features/player/containers/LinkToActiveAlbum';

export default function Player() {
  const theme = useTheme();
  const track = useActiveTrack();

  return (
    <>
      <Stack.Screen
        options={{
          // animation: 'flip',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <FontAwesome
                name="angle-down"
                size={32}
                color={theme.colors.onSurface}
              />
            </Pressable>
          ),
          title: track?.album,
          headerTitle: () => (
            // Tap on the name of the mixtape to navigate to it
            <LinkToActiveAlbum isInModal>
              <Text>{track?.album}</Text>
            </LinkToActiveAlbum>
          ),
        }}
      />
      <View style={styles.container}>
        <TrackInfo />
        <Progress />
        <PlayerControls />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
