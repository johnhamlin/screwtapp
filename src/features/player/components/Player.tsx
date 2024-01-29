import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { Text } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';

import { SetupService } from '../services';
import { setPlayerReady } from '../slices/playerSlice';

import { RootState } from '@/store';

export default function Player() {
  const dispatch = useDispatch();

  // react-native-track-player
  dispatch(setPlayerReady(useSetupPlayer()));
  // const isPlayerReady = useSelector(
  //   (state: RootState) => state.player.isPlayerReady
  // );

  const rntpPlay = async () => {
    // Add a track to the queue
    await TrackPlayer.add({
      id: 'trackId',
      url: 'https://ia601902.us.archive.org/22/items/20200602_20200602_1746/101.%20E.S.G.%20-%20Watch%20Yo%20Screw.mp3',
      title: 'Track Title',
      artist: 'Track Artist',
      // artwork: require('track.png'),
    });

    // Start playing it
    await TrackPlayer.play();
  };

  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  console.log({ sound });
  // console.log({ dir, file });
  const { dir, file } = useSelector(
    (state: RootState) => state.player.playerProps,
  );

  async function playSound() {
    console.log('Loading Sound');
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      allowsRecordingIOS: false,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
    });

    if (dir && file) {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: 'https://archive.org' + dir + '/' + encodeURIComponent(file),
        },
        { shouldPlay: true },
      );
      setSound(sound);

      console.log('Playing Sound');
      await sound.playAsync();
    }
  }

  async function playPauseSound() {
    if (sound) {
      setIsPlaying(isPlaying => !isPlaying);
      sound.setStatusAsync({ shouldPlay: isPlaying });
    }
  }

  // change the song playing whenever the props change
  useEffect(() => {
    console.log('use effect running!');

    playSound();
  }, [dir, file]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  return (
    <View
      // TODO: Figure out a better way to include theme into Nativewind
      className="bg-[#f3edf6] dark:bg-[#2c2831] pb-5"
      // style={{ backgroundColor: theme.colors.elevation.level2 }}
    >
      <Button title="play with rntp" onPress={rntpPlay} />
      {file ? <Text>Now Playing {file}</Text> : null}
      {/* <Button onPress={playSound}>Load and Play Sound</Button> */}
      <Button title="Play/Pause" onPress={playPauseSound} />
    </View>
  );
}

function useSetupPlayer() {
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await SetupService();
      if (unmounted) return;
      setPlayerReady(true);
      // const queue = await TrackPlayer.getQueue();
      // if (unmounted) return;
      // if (queue.length <= 0) {
      //   await QueueInitialTracksService();
      // }
    })();
    return () => {
      unmounted = true;
    };
  }, []);
  return playerReady;
}
