import { http, HttpResponse } from 'msw';

import { mixtapeListFixture } from './fixtures/mixtapeList';
import { mixtapeMetadataFixture } from './fixtures/mixtapeMetadata';

export const handlers = [
  http.get('https://archive.org/services/search/v1/scrape', () => {
    return HttpResponse.json(mixtapeListFixture);
  }),

  http.get('https://archive.org/metadata/:identifier', () => {
    return HttpResponse.json(mixtapeMetadataFixture);
  }),
];
