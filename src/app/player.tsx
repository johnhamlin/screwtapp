import { FontAwesome } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { useSelector, useStore } from 'react-redux';

import {
  PlayerControls,
  Progress,
  TrackInfo,
} from '../features/player/components';

import playerSlice from '@/features/player/slices/playerSlice';
import { RootState } from '@/reduxStore';

export default function Player() {
  const theme = useTheme();
  const track = useActiveTrack();

  // ? Should I store the active track in redux so we don't have to use the queue?
  const firstTrackInQueue = useSelector(
    (state: RootState) => state.player.queue?.[0],
  );
  const id = firstTrackInQueue?.mixtapeId;

  return (
    <>
      <Stack.Screen
        options={{
          // animation: 'flip',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
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
            <Pressable
              onPress={() => {
                // close the modal with back
                router.back();
                // navigate to the mixtape
                if (id) {
                  router.navigate({
                    pathname: 'mixtape/[id]',
                    params: { id },
                  });
                }
              }}
            >
              <Text>{track?.album}</Text>
            </Pressable>
          ),
        }}
      />

      <View
        style={{
          ...styles.container,
          // backgroundColor: theme.colors.elevation.level2,
        }}
      >
        <TrackInfo />
        <Progress />
        <PlayerControls />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
