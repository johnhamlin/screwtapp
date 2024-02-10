/**
 * The raw response returned from archive.org for mixtapeApi/getMixtapeList
 */
export interface MixtapeListResponse {
  items: MixtapeRawResponse[];
  count: number;
  total: number;
}

// The type of the items array in MixtapeListResponse
export interface MixtapeRawResponse {
  title: string;
  date: string;
  creator: string;
  identifier: string;
  downloads: number;
}

/**
 * The raw response returned from archive.org for mixtapeApi/getMixtape
 */
export interface MixtapeMetadataRawResponse {
  files: FileRawResponse[];
  dir: string;
  created: number;
  d1: string;
  d2: string;
  files_count: number;
  item_last_updated: number;
  item_size: number;
  metadata: Metadata;
  server: string;
  uniq: number;
  workable_servers: string[];
}

// The type of the files array in MixtapeMetadataRawResponse
interface FileRawResponse {
  name: string;
  source: string;
  format: string;
  original?: string;
  mtime?: string;
  size?: string;
  md5: string;
  crc32?: string;
  sha1?: string;
  length?: string;
  height?: string;
  width?: string;
  title?: string;
  creator?: string;
  album?: string;
  track?: string;
  artist?: string;
  genre?: string;
  rotation?: string;
  btih?: string;
}

// The type derived from fileRawResponse by filtering out files that don't have a length property. (Only tracks have a length property)
export interface TrackRawResponse {
  name: string;
  source: string;
  mtime: string;
  size: string;
  md5: string;
  crc32: string;
  sha1: string;
  format: string;
  length: string;
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
