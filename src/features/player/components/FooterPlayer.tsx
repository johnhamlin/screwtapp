import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { Easing, SlideInDown } from 'react-native-reanimated';
import TextTicker from 'react-native-text-ticker';
import { useActiveTrack } from 'react-native-track-player';
import { useSelector } from 'react-redux';

import { PlayPauseButton } from './PlayPauseButton';
import { Spacer } from './Spacer';

import { RootState } from '@/reduxStore';
import { rgbStringToRgbaString } from '@/styles/utils';

export default function FooterPlayer() {
  const theme = useTheme();
  const track = useActiveTrack();
  const isFooterPlayerVisible = useSelector(
    (state: RootState) => state.player.isFooterPlayerVisible,
  );

  return (
    isFooterPlayerVisible && (
      <Pressable
        style={{ backgroundColor: 'transparent' }}
        onPress={() => router.navigate('/player')}
      >
        <Animated.View
          entering={SlideInDown}
          style={{
            ...styles.container,
            backgroundColor: rgbStringToRgbaString(
              theme.colors.elevation.level2,
              0.96,
            ),
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
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    paddingBottom: 12,
    // Absolute position at the bottom allows it to overlay content and be translucent
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
