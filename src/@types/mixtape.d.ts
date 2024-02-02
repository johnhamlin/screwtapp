// type for a each mixtape
interface Mixtape {
  title: string;
  date: string;
  creator: string;
  identifier: string;
  downloads: number;
}

interface PlayerProps {
  dir: string | null;
  file: string | null;
}

interface archiveApiTrack {
  name: string;
  dir: string;
  source: string;
  mtime: string;
  size: string;
  md5: string;
  crc32: string;
  sha1: string;
  format: string;
  length: number;
  height: string;
  width: string;
  title: string;
  creator: string;
  album: string;
  track: string;
  artist: string;
  genre: string;
}
interface Metadata {
  identifier: string;
  creator: string;
  date: string;
  description: string;
  language: string;
  mediatype: string;
  scanner: string;
  subject: string[];
  title: string;
  year: string;
  uploader: string;
  publicdate: string;
  addeddate: string;
  curation: string;
  collection: string[];
}
