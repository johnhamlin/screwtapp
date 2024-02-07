import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { Easing, SlideInDown } from 'react-native-reanimated';
import TextTicker from 'react-native-text-ticker';
import { useActiveTrack } from 'react-native-track-player';

import { PlayPauseButton } from './PlayPauseButton';
import { Spacer } from './Spacer';

export default function FooterPlayer() {
  const theme = useTheme();
  const track = useActiveTrack();

  return (
    <Pressable onPress={() => router.navigate('/player')}>
      <Animated.View
        entering={SlideInDown}
        style={{
          ...styles.container,
          backgroundColor: theme.colors.elevation.level2,
        }}
      >
        <Spacer />
        <View style={styles.trackInfoContainer}>
          {track?.artwork && (
            <Image style={styles.artwork} source={{ uri: track?.artwork }} />
          )}
          <View style={styles.trackTextContainer}>
            {track?.title && (
              <TextTicker
                style={{ ...styles.titleText, color: theme.colors.onSurface }}
                // bounce
                animationType="bounce"
                marqueeDelay={750}
                scrollSpeed={70}
                easing={Easing.sin}
                bounceDelay={1000}
                bouncePadding={{ left: 0, right: 10 }}
              >
                {track?.title}
              </TextTicker>
            )}
            {track?.artist && (
              <Text style={styles.artistText}>{track?.artist}</Text>
            )}
          </View>
          <PlayPauseButton mode="footer" />
        </View>
        <Spacer />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    paddingBottom: 12,
  },
  trackInfoContainer: {
    flex: 0,
    flexDirection: 'row',
    marginLeft: 24,
  },
  artwork: {
    width: '10%',
    aspectRatio: 1,
    backgroundColor: 'grey',
    marginRight: 16,
  },
  trackTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    // color: 'white',
    // marginTop: 30,
  },
  artistText: {
    fontSize: 16,
    fontWeight: '200',
    // color: 'white',
  },
});
