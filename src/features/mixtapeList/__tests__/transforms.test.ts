import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';

import { mixtapeListFixture } from '@/mocks/fixtures/mixtapeList';
import { mixtapeMetadataFixture } from '@/mocks/fixtures/mixtapeMetadata';
import { server } from '@/mocks/server';

import { mixtapeListApi } from '../slices/mixtapeListApi';

function createTestStore() {
  return configureStore({
    reducer: { [mixtapeListApi.reducerPath]: mixtapeListApi.reducer },
    middleware: gDM => gDM().concat(mixtapeListApi.middleware),
    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers({ autoBatch: false }),
  });
}

/** Dispatch a query, unwrap the result, and immediately unsubscribe to prevent
 *  RTK Query's keepUnusedDataFor timer from firing after Jest tears down. */
async function dispatchAndUnsubscribe<T>(
  store: ReturnType<typeof createTestStore>,
  thunk: ReturnType<
    | typeof mixtapeListApi.endpoints.getMixtapeList.initiate
    | typeof mixtapeListApi.endpoints.getMixtape.initiate
  >,
): Promise<T> {
  const promise = store.dispatch(thunk);
  const result = await promise.unwrap();
  promise.unsubscribe();
  return result as T;
}

// ─── getMixtapeList.transformResponse ────────────────────────────────────────

describe('getMixtapeList transformResponse', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  afterEach(async () => {
    store.dispatch(mixtapeListApi.util.resetApiState());
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('strips "DJ Screw - " prefix from titles', async () => {
    const result = await dispatchAndUnsubscribe<Mixtape[]>(
      store,
      mixtapeListApi.endpoints.getMixtapeList.initiate(''),
    );

    // Original: "DJ Screw - Chapter 001: Tha Originator (1993)"
    // After strip prefix + suffix: "Chapter 001: Tha Originator"
    expect(result[0].title).toBe('Chapter 001: Tha Originator');
    expect(result[1].title).toBe('Chapter 012: June 27th');
    expect(result[2].title).toBe('All Screwed Up');
  });

  it('strips " (YYYY)" year suffix from titles', async () => {
    const result = await dispatchAndUnsubscribe<Mixtape[]>(
      store,
      mixtapeListApi.endpoints.getMixtapeList.initiate(''),
    );

    // None of the transformed titles should end with a (YYYY) pattern
    for (const mixtape of result) {
      expect(mixtape.title).not.toMatch(/ \(\d{4}\)$/);
    }
  });

  it('generates thumbnail URL from identifier', async () => {
    const result = await dispatchAndUnsubscribe<Mixtape[]>(
      store,
      mixtapeListApi.endpoints.getMixtapeList.initiate(''),
    );

    expect(result[0].thumbnail).toBe(
      'https://archive.org/services/img/dj-screw-chapter-001',
    );
    expect(result[1].thumbnail).toBe(
      'https://archive.org/services/img/dj-screw-chapter-012',
    );
    expect(result[2].thumbnail).toBe(
      'https://archive.org/services/img/dj-screw-all-screwed-up',
    );
  });

  it('maps identifier to id', async () => {
    const result = await dispatchAndUnsubscribe<Mixtape[]>(
      store,
      mixtapeListApi.endpoints.getMixtapeList.initiate(''),
    );

    expect(result[0].id).toBe(mixtapeListFixture.items[0].identifier);
    expect(result[1].id).toBe(mixtapeListFixture.items[1].identifier);
    expect(result[2].id).toBe(mixtapeListFixture.items[2].identifier);
  });

  it('preserves other fields from the raw response', async () => {
    const result = await dispatchAndUnsubscribe<Mixtape[]>(
      store,
      mixtapeListApi.endpoints.getMixtapeList.initiate(''),
    );

    expect(result[0].date).toBe(mixtapeListFixture.items[0].date);
    expect(result[0].creator).toBe(mixtapeListFixture.items[0].creator);
    expect(result[0].downloads).toBe(mixtapeListFixture.items[0].downloads);
  });

  it('returns correct number of mixtapes', async () => {
    const result = await dispatchAndUnsubscribe<Mixtape[]>(
      store,
      mixtapeListApi.endpoints.getMixtapeList.initiate(''),
    );

    expect(result).toHaveLength(3);
  });

  it('handles empty items array', async () => {
    server.use(
      http.get('https://archive.org/services/search/v1/scrape', () => {
        return HttpResponse.json({ items: [], count: 0, total: 0 });
      }),
    );

    const result = await dispatchAndUnsubscribe<Mixtape[]>(
      store,
      mixtapeListApi.endpoints.getMixtapeList.initiate(''),
    );

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});

// ─── getMixtape.transformResponse ───────────────────────────────────────────

describe('getMixtape transformResponse', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  afterEach(async () => {
    store.dispatch(mixtapeListApi.util.resetApiState());
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('filters files to only tracks (files with length property)', async () => {
    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate('dj-screw-chapter-001'),
    );

    // Fixture has 5 files total but only 3 have a length property (the tracks)
    expect(result).toHaveLength(3);
  });

  it('maps track fields correctly', async () => {
    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate('dj-screw-chapter-001'),
    );

    const firstTrack = result[0];
    expect(firstTrack.sha1).toBe('sha1track1');
    expect(firstTrack.title).toBe('Intro');
    expect(firstTrack.artist).toBe('DJ Screw');
    expect(firstTrack.album).toBe('Chapter 001: Tha Originator');
    expect(firstTrack.genre).toBe('Hip Hop');
    expect(firstTrack.isLiveStream).toBe(false);
    expect(firstTrack.mixtapeId).toBe('dj-screw-chapter-001');
  });

  it('parses duration as a number', async () => {
    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate('dj-screw-chapter-001'),
    );

    expect(result[0].duration).toBe(245.5);
    expect(typeof result[0].duration).toBe('number');
    expect(result[1].duration).toBe(387.2);
    expect(result[2].duration).toBe(310.8);
  });

  it('resolves artwork using Front.jpg when present', async () => {
    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate('dj-screw-chapter-001'),
    );

    const expectedArtwork =
      'https://archive.org/download/dj-screw-chapter-001/Front.jpg';

    // All tracks in the same mixtape share the same artwork
    for (const track of result) {
      expect(track.artwork).toBe(expectedArtwork);
    }
  });

  it('falls back to thumbnail URL when Front.jpg is not present', async () => {
    // Override with fixture data that has no Front.jpg
    const filesWithoutFrontCover = mixtapeMetadataFixture.files.filter(
      file => file.name !== 'Front.jpg',
    );
    server.use(
      http.get('https://archive.org/metadata/:identifier', () => {
        return HttpResponse.json({
          ...mixtapeMetadataFixture,
          files: filesWithoutFrontCover,
        });
      }),
    );

    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate('dj-screw-chapter-001'),
    );

    const expectedFallback =
      'https://archive.org/services/img/dj-screw-chapter-001';

    for (const track of result) {
      expect(track.artwork).toBe(expectedFallback);
    }
  });

  it('encodes file names in URLs', async () => {
    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate('dj-screw-chapter-001'),
    );

    // "01 - Intro.mp3" should be encoded as "01%20-%20Intro.mp3"
    expect(result[0].url).toBe(
      'https://archive.org/download/dj-screw-chapter-001/01%20-%20Intro.mp3',
    );
    expect(result[1].url).toBe(
      'https://archive.org/download/dj-screw-chapter-001/02%20-%20Sippin%20Codeine.mp3',
    );
    expect(result[2].url).toBe(
      'https://archive.org/download/dj-screw-chapter-001/03%20-%20Southside%20Still%20Holdin.mp3',
    );
  });

  it('includes directoryOnArchiveDotOrg from response dir', async () => {
    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate('dj-screw-chapter-001'),
    );

    for (const track of result) {
      expect(track.directoryOnArchiveDotOrg).toBe(
        '/27/items/dj-screw-chapter-001',
      );
    }
  });

  it('includes fileName from the raw track name', async () => {
    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate('dj-screw-chapter-001'),
    );

    expect(result[0].fileName).toBe('01 - Intro.mp3');
    expect(result[1].fileName).toBe('02 - Sippin Codeine.mp3');
    expect(result[2].fileName).toBe('03 - Southside Still Holdin.mp3');
  });

  it('sets mixtapeId to the query argument for all tracks', async () => {
    const mixtapeId = 'dj-screw-chapter-001';
    const result = await dispatchAndUnsubscribe<MixtapeTrack[]>(
      store,
      mixtapeListApi.endpoints.getMixtape.initiate(mixtapeId),
    );

    for (const track of result) {
      expect(track.mixtapeId).toBe(mixtapeId);
    }
  });
});
