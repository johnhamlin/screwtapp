import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { Box, Button, Text } from 'native-base';
import { useEffect, useState } from 'react';

function Player({ dir, file }: PlayerProps) {
  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  console.log({ sound });
  // console.log({ dir, file });

  async function playSound() {
    console.log('Loading Sound');
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
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
    <Box>
      {file ? <Text>Now Playing {file}</Text> : null}
      {/* <Button onPress={playSound}>Load and Play Sound</Button> */}
      <Button onPress={playPauseSound}>Play/Pause</Button>
    </Box>
  );
}
export default Player;
