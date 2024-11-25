import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { Easing, SlideInDown } from 'react-native-reanimated';
import TextTicker from 'react-native-text-ticker';
import { useActiveTrack } from 'react-native-track-player';

import { PlayPauseButton } from './PlayPauseButton';
import { Spacer } from './Spacer';
// @ts-expect-error
import artworkPlaceholder from '../../../assets/artwork_placeholder.jpg';
import LinkToActiveAlbum from '../containers/LinkToActiveAlbum';
import { selectIsFooterPlayerVisible } from '../slice';

import { useAppSelector } from '@/hooks/reduxHooks';
import { rgbStringToRgbaString } from '@/styles/utils';

export default function FooterPlayer() {
  const theme = useTheme();
  const track = useActiveTrack();
  // const selectIsFooterPlayerVisible = useMemo(makeIsFooterPlayerVisible, []);
  const isFooterPlayerVisible = useAppSelector(selectIsFooterPlayerVisible);

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
            <LinkToActiveAlbum style={styles.artworkContainer}>
              <Image
                style={styles.artwork}
                source={{ uri: track?.artwork }}
                placeholder={artworkPlaceholder}
              />
            </LinkToActiveAlbum>
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
  artworkContainer: {
    width: '12%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flex: 0,
  },

  artwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 5,
    backgroundColor: 'grey',
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
