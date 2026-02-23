import { http, HttpResponse } from 'msw';

import { mixtapeListFixture } from '../fixtures/mixtapeList';
import { mixtapeMetadataFixture } from '../fixtures/mixtapeMetadata';
import { server } from '../server';

test('default handler returns mixtape list fixture data', async () => {
  const response = await fetch(
    'https://archive.org/services/search/v1/scrape?fields=title,date,identifier,downloads,creator&q=collection:dj-screw-discography',
  );
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.items).toHaveLength(3);
  expect(data.items[0].identifier).toBe(
    mixtapeListFixture.items[0].identifier,
  );
});

test('default handler returns mixtape metadata fixture data', async () => {
  const response = await fetch(
    'https://archive.org/metadata/dj-screw-chapter-001',
  );
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.files).toHaveLength(mixtapeMetadataFixture.files.length);
  expect(data.dir).toBe(mixtapeMetadataFixture.dir);
});

test('per-test override works with server.use()', async () => {
  server.use(
    http.get('https://archive.org/services/search/v1/scrape', () => {
      return HttpResponse.json({ items: [], count: 0, total: 0 });
    }),
  );

  const response = await fetch(
    'https://archive.org/services/search/v1/scrape',
  );
  const data = await response.json();

  expect(data.items).toHaveLength(0);
});

test('unhandled request throws error', async () => {
  await expect(
    fetch('https://example.com/unknown-endpoint'),
  ).rejects.toThrow();
});
