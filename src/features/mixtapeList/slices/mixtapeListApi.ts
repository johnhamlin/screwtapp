import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PitchAlgorithm } from 'react-native-track-player';

import type {
  MixtapeListResponse,
  MixtapeMetadataRawResponse,
  TrackRawResponse,
} from '../@types/mixtapeListApi';

export const mixtapeListApi = createApi({
  reducerPath: 'mixtapeListApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://archive.org/' }),
  tagTypes: ['MixtapeList'],
  endpoints: builder => ({
    getMixtapeList: builder.query<Mixtape[], string>({
      query: () =>
        'services/search/v1/scrape?fields=title,date,identifier,downloads,creator&q=collection:dj-screw-discography',
      transformResponse: ({ items }: MixtapeListResponse) =>
        items.map(item => ({
          ...item,
          id: item.identifier,
          title: item.title
            .replace(/^DJ Screw - /, '')
            .replace(/ \(\d{4}\)$/, ''),
          thumbnail: `https://archive.org/services/img/${item.identifier}`,
        })),

      providesTags: ['MixtapeList'],
    }),
    // getThumbnail: builder.query({
    //   query: identifier => `/services/img/${identifier}`,
    // }),
    // getMixtapeMetadata: builder.query<MixtapeMetadataResponse, string>({
    //   query: identifier => `metadata/${identifier}`,
    // }),

    getMixtape: builder.query<MixtapeTrack[], string>({
      query: (identifier: string) => `metadata/${identifier}`,
      transformResponse: (response: MixtapeMetadataRawResponse, _meta, arg) => {
        const tracks = response.files.filter(
          // Only files with a length property are tracks
          file => Object.hasOwn(file, 'length'),
          // This type assertion is kind of dangerous, but I know I've filtered the MixtapeFiles down to just RawTracks (https://typescript.tv/errors/#TS2352)
        ) as unknown as TrackRawResponse[];

        // Grab anything else we need off the response object
        const { dir } = response;

        // Find the front cover file, if it exists. If not, default to the archive.org thumbnail
        const frontCoverFile = response.files.find(
          file => file.name === 'Front.jpg',
        );
        const artwork = frontCoverFile
          ? `https://archive.org${response.dir}/${encodeURIComponent(frontCoverFile.name)}`
          : `https://archive.org/services/img/${arg}`;

        // Mutate to work with RNTP Track type, plus any other info we need
        return tracks.map(track => ({
          // archive.org doesn't have a unique id for each track, so we'll use the sha1 of the file
          sha1: track.sha1,
          url: `https://archive.org${response.dir}/${encodeURIComponent(track.name)}`,
          type: undefined,
          userAgent: undefined,
          contentType: undefined,
          // the duration in seconds
          duration: Number(track.length),
          title: track.title,
          artist: track.artist,
          album: track.album,
          description: undefined,
          genre: track.genre,
          date: undefined,
          rating: undefined,
          artwork,
          pitchAlgorithm: PitchAlgorithm.Music,
          headers: undefined,
          isLiveStream: false,
          // Additional info no on the RNTP Track type
          directoryOnArchiveDotOrg: dir,
          fileName: track.name,
          // The mixtapeId was passed in as the arg to the query to fetch the tracks, so it's the same for all of them
          mixtapeId: arg,
        }));
      },
    }),
  }),
});

export const {
  useGetMixtapeListQuery,
  // useGetThumbnailQuery,
  // useGetMixtapeMetadataQuery,
  useGetMixtapeQuery,
} = mixtapeListApi;
