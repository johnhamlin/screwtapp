import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const COLLECTION_URL =
  'https://archive.org/services/search/v1/scrape?fields=title,date,identifier,downloads,creator&q=collection:dj-screw-discography';

interface MixtapeListResponse {
  items: Mixtape[];
  count: number;
  total: number;
}

export const mixtapeListApi = createApi({
  reducerPath: 'mixtapeListApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://archive.org/' }),
  endpoints: builder => ({
    getMixtapeList: builder.query({
      query: () =>
        'services/search/v1/scrape?fields=title,date,identifier,downloads,creator&q=collection:dj-screw-discography',
      transformResponse: (response: MixtapeListResponse, meta, arg) =>
        response.items,
    }),
    getMixtapeMetadata: builder.query({
      query: (identifier: string) => `metadata/${identifier}`,
    }),
  }),
});

export const { useGetMixtapeListQuery, useGetMixtapeMetadataQuery } =
  mixtapeListApi;
