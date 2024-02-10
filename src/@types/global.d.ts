import { Track } from 'react-native-track-player';

declare global {
  // type for a each mixtape
  interface Mixtape {
    title: string;
    date: string;
    creator: string;
    id: string;
    downloads: number;
    thumbnail: string;
  }

  interface MixtapeTrack extends Track {
    sha1: string;
    mixtapeId: string;
    directoryOnArchiveDotOrg: string;
    fileName: string;
    duration: number;
  }
}
