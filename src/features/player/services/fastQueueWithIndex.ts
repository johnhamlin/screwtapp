import TrackPlayer from 'react-native-track-player';
import type { Track as rntpTrack } from 'react-native-track-player';

export async function fastQueueWithIndex({
  queue,
  index,
  shouldPlay = false,
}: {
  queue: rntpTrack[];
  index: number;
  shouldPlay?: boolean;
}) {
  // Set the queue, starting with the track the user selected and begin playing
  await TrackPlayer.setQueue(queue.slice(index));
  if (shouldPlay) {
    await TrackPlayer.play();
  }

  // Add tracks before the one the user selected to the queue asynchronously, so the user can use PlaybackButtons to skip backward in the queue
  // Doing it this way because loading the queue and then jumping to the correct track is slow and janky on the UI
  await TrackPlayer.add(queue.slice(0, index), 0);
  // console.log('queue:', queue);
  // console.log('trackPlayerQueue:', await TrackPlayer.getQueue());
  // console.log('index:', index);
  // console.log('trackPlayerIndex:', await TrackPlayer.getActiveTrackIndex());
}
