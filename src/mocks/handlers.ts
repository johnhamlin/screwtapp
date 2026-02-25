import { http, HttpResponse } from 'msw';

import { mixtapeListFixture } from './fixtures/mixtapeList';
import { mixtapeMetadataFixture } from './fixtures/mixtapeMetadata';

export const handlers = [
  http.get('https://archive.org/services/search/v1/scrape', () => {
    return HttpResponse.json(mixtapeListFixture);
  }),

  http.get('https://archive.org/metadata/:identifier', ({ params }) => {
    if (params.identifier !== mixtapeMetadataFixture.metadata.identifier) {
      return HttpResponse.json(
        { error: 'Item not found' },
        { status: 404 },
      );
    }
    return HttpResponse.json(mixtapeMetadataFixture);
  }),
];
