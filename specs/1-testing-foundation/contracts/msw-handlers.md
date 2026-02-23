# Contract: MSW Handlers

## Purpose

Centralized network mock handlers for Archive.org API endpoints
used by RTK Query in all unit/integration tests.

## Default Handlers

### `GET /services/search/v1/scrape` (getMixtapeList)

- **Success**: Returns `MixtapeListResponse` with 3 fixture
  mixtapes. Status 200.
- **Fixture data**: Realistic Archive.org response shape with
  `items`, `count`, `total` fields.

### `GET /metadata/:identifier` (getMixtape)

- **Success**: Returns `MixtapeMetadataRawResponse` with 3
  fixture tracks + non-track files. Status 200.
- **Fixture data**: Includes Front.jpg cover file, audio files
  with `length` property, and metadata files without.

## Per-Test Override Patterns

```typescript
// Error state
server.use(
  http.get('https://archive.org/services/search/v1/scrape', () =>
    HttpResponse.json(null, { status: 500 }),
  ),
);

// Empty state
server.use(
  http.get('https://archive.org/services/search/v1/scrape', () =>
    HttpResponse.json({ items: [], count: 0, total: 0 }),
  ),
);

// Slow/timeout
server.use(
  http.get('https://archive.org/services/search/v1/scrape', async () => {
    await delay('infinite');
  }),
);
```

## Server Configuration

```typescript
const server = setupServer(...handlers);

// jest.setup.ts
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Location

- Handlers: `src/mocks/handlers.ts`
- Server: `src/mocks/server.ts`
- Fixtures: `src/mocks/fixtures/`
