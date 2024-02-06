import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface MixtapeListResponse {
  items: Mixtape[];
  count: number;
  total: number;
}

interface MixtapeMetadataResponse {
  created: number;
  d1: string;
  d2: string;
  dir: string;
  files: MixtapeFile[];
  files_count: number;
  item_last_updated: number;
  item_size: number;
  metadata: Metadata;
  server: string;
  uniq: number;
  workable_servers: string[];
}

interface MixtapeFile {
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

interface RawTrack {
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

export const mixtapeListApi = createApi({
  reducerPath: 'mixtapeListApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://archive.org/' }),
  tagTypes: ['MixtapeList'],
  endpoints: builder => ({
    getMixtapeList: builder.query({
      query: () =>
        'services/search/v1/scrape?fields=title,date,identifier,downloads,creator&q=collection:dj-screw-discography',
      transformResponse: ({ items }: MixtapeListResponse, meta, arg) =>
        items.map(item => ({
          ...item,
          title: item.title
            .replace(/^DJ Screw - /, '')
            .replace(/ \(\d{4}\)$/, ''),
        })),
      providesTags: ['MixtapeList'],
    }),
    getThumbnail: builder.query({
      query: identifier => `/services/img/${identifier}`,
    }),
    getMixtapeMetadata: builder.query<MixtapeMetadataResponse, string>({
      query: identifier => `metadata/${identifier}`,
    }),

    getMixtape: builder.query<archiveApiTrack[], string>({
      query: (identifier: string) => `metadata/${identifier}`,
      transformResponse: (response: MixtapeMetadataResponse) => {
        const tracks = response.files.filter(
          file => Object.hasOwn(file, 'length'),
          // This type assertion is kind of dangerous, but I know I've filtered the MixtapeFiles down to just RawTracks (https://typescript.tv/errors/#TS2352)
        ) as unknown as RawTrack[];

        // Doing any mutations / additions of properties that I need here to avoid running them over and over again in React
        return tracks.map(track => {
          return {
            ...track,
            length: Number(track.length),
            dir: response.dir,
          };
        });
      },
    }),
  }),
});

export const {
  useGetMixtapeListQuery,
  useGetThumbnailQuery,
  useGetMixtapeMetadataQuery,

  useGetMixtapeQuery,
} = mixtapeListApi;
