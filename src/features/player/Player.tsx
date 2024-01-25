import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';

function Player() {
  const theme = useTheme();

  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  console.log({ sound });
  // console.log({ dir, file });
  const { dir, file } = useSelector(
    (state: RootState) => state.player.playerProps
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
        { shouldPlay: true }
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
    <SafeAreaView style={{ backgroundColor: theme.colors.elevation.level2 }}>
      {file ? <Text>Now Playing {file}</Text> : null}
      {/* <Button onPress={playSound}>Load and Play Sound</Button> */}
      <Button title="Play/Pause" onPress={playPauseSound} />
    </SafeAreaView>
  );
}
export default Player;
