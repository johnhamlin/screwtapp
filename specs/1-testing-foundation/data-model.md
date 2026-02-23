# Data Model: Testing & Coverage Foundation

## Entities Under Test

### Mixtape (Global Type)

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| title | string | Transformed (prefix stripped) | `"DJ Screw - Title (2001)"` → `"Title"` |
| date | string | Raw from Archive.org | |
| creator | string | Raw | |
| id | string | Derived from `identifier` | |
| downloads | number | Raw | |
| thumbnail | string | Derived | `https://archive.org/services/img/{identifier}` |

### MixtapeTrack (Global Type, extends RNTP Track)

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| sha1 | string | Raw | Used as unique ID |
| url | string | Derived | `https://archive.org/download/{id}/{encodedName}` |
| duration | number | Parsed from string | `Number(track.length)` |
| title | string | Raw | |
| artist | string | Raw | |
| album | string | Raw | |
| genre | string | Raw | |
| artwork | string | Derived | Front.jpg or fallback thumbnail |
| pitchAlgorithm | PitchAlgorithm | Constant | `PitchAlgorithm.Music` |
| isLiveStream | boolean | Constant | `false` |
| directoryOnArchiveDotOrg | string | Raw `dir` | |
| fileName | string | Raw `name` | |
| mixtapeId | string | Query arg | |

### PlayerState (Redux Slice)

| Field | Type | Default | Reducers |
|-------|------|---------|----------|
| isPlayerReady | boolean | false | `setIsPlayerReady` |
| currentTrack | string | '' | (unused) |
| isPlaying | boolean | false | (unused) |
| queue | MixtapeTrack[] \| null | null | `setQueue` |
| queueIndex | number \| null | null | `setQueueIndex` |
| isFooterPlayerVisible | boolean | false | `setFooterPlayerVisible` |

### Selectors

| Selector | Input | Output |
|----------|-------|--------|
| `selectIsFooterPlayerVisible` | RootState | boolean |
| `selectActiveTrackId` | RootState | string \| null (mixtapeId of active track) |

## API Response Shapes (Mock Data Targets)

### Archive.org Scrape API (`getMixtapeList`)

```typescript
// Input: MixtapeListResponse
{
  items: MixtapeRawResponse[],  // array of mixtape metadata
  count: number,                 // items in response
  total: number                  // total available
}
```

### Archive.org Metadata API (`getMixtape`)

```typescript
// Input: MixtapeMetadataRawResponse
{
  files: FileRawResponse[],  // all files (tracks + non-tracks)
  dir: string,                // directory path on archive.org
  // ... other metadata fields
}
```

## Transform Functions (Mutation Testing Targets)

| Function | Input | Output | Key Logic |
|----------|-------|--------|-----------|
| `getMixtapeList.transformResponse` | `MixtapeListResponse` | `Mixtape[]` | Strip prefix, strip year suffix, generate thumbnail URL, assign `id` from `identifier` |
| `getMixtape.transformResponse` | `MixtapeMetadataRawResponse` | `MixtapeTrack[]` | Filter to tracks (has `length`), map to RNTP Track, resolve artwork (Front.jpg or fallback) |
| `rgbStringToRgbaString` | `(string, number)` | `string` | Extract RGB numbers via regex, format as `rgba(r, g, b, alpha)` |
