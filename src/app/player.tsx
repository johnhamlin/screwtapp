import { FontAwesome } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';

import {
  PlayerControls,
  Progress,
  TrackInfo,
} from '../features/player/components';

export default function Player() {
  const theme = useTheme();
  const track = useActiveTrack();

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
        }}
      />

      <View
        // className="bg-[#f3edf6] dark:bg-[#2c2831] pb-5"
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
