# Fix Notes: Production Bugs Found During Testing

AI cannot edit production code per Constitution P1 — a human developer must apply these fixes.

## Required Changes

None.

## Previously Fixed Changes Discovered By Claude Through Testing

These production bugs were discovered during test development for PR #2 (testing foundation).

1. **`selectActiveTrackId` out-of-bounds** (`src/features/player/slice/playerSelectors.ts:42-43`):
   - `queue[queueIndex].mixtapeId` is accessed without bounds checking. When `queueIndex >= queue.length`, this throws a `TypeError: Cannot read properties of undefined`.
   - The null checks on line 42 only verify that `queue` and `queueIndex` are not `null` — they do not verify that `queueIndex` is a valid index within the array.
   - Documented by test case in `src/features/player/__tests__/playerSelectors.test.ts` (line 99).
   - Suggested fix:

     ```ts
     export const selectActiveTrackId = (state: RootState) => {
       if (
         state.player.queue !== null &&
         state.player.queueIndex !== null &&
         state.player.queueIndex < state.player.queue.length
       ) {
         return state.player.queue[state.player.queueIndex].mixtapeId;
       }
       return null;
     };
     ```

2. **Mixtape detail empty state crash** (`src/app/mixtape/[id]/index.tsx:47`):
   - `trackList[0].album` throws `TypeError` when `trackList` is an empty array (`[]`). The ternary `trackList ? trackList[0].album : ''` only guards against `undefined`/`null`, not an empty array.
   - Documented by `test.skip` in `src/app/mixtape/__tests__/[id].test.tsx` (line 63).
   - Suggested fix:

     ```tsx
     title: trackList?.length ? trackList[0].album : '',
     ```
