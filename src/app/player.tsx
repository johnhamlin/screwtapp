import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import {
  PlayerControls,
  Progress,
  TrackInfo,
} from '../features/player/components';

export default function Player() {
  const theme = useTheme();

  return (
    <>
      <View
        style={{
          ...styles.closeModalContainer,
          // backgroundColor: theme.colors.elevation.level2,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <FontAwesome
            name="angle-down"
            size={32}
            color={theme.colors.onSurface}
          />
        </Pressable>
      </View>
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
  closeModalContainer: {
    marginTop: 18,
    marginLeft: 18,
  },
});
