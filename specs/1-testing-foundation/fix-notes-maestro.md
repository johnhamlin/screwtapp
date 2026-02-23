# Fix Notes: Maestro Testability

These production code changes are needed for E2E test stability. AI cannot make them per Constitution P1.

## Required Changes

1. **FooterPlayer** (`src/features/player/components/FooterPlayer.tsx`):
   - Add `testID="footer-player"` to root container (`Animated.View` on line 31 or the wrapping `Pressable` on line 27)

2. **PlayerControls** (`src/features/player/components/PlayerControls.tsx`):
   - Add `testID="play-pause-button"` to PlayPauseButton wrapper
   - Add `testID="skip-forward-button"` to the skip-next `TouchableWithoutFeedback` (line 21)
   - Add `testID="skip-back-button"` to the skip-previous `TouchableWithoutFeedback` (line 17)

3. **PlayPauseButton** (`src/features/player/components/PlayPauseButton.tsx`):
   - Add `accessibilityLabel="Play"` when paused
   - Add `accessibilityLabel="Pause"` when playing
   - These labels allow Maestro to locate the play/pause control by accessibility text

4. **FlashList items** (Home screen `src/app/index.tsx`, Mixtape detail `src/app/mixtape/[id]/index.tsx`):
   - Consider adding `testID` to list item wrappers for Maestro `scrollUntilVisible`
   - Home screen: add `testID` to the `Link` or `List.Item` wrapping each mixtape
   - Track list: add `testID` to the `Pressable` wrapping each track item

## Notes

- The iOS bundle identifier (`in.johnhaml.screwtapp`) differs from the Android package (`com.johnhamlin.screwtapp`). The Maestro flows use the Android package. For iOS testing, update `appId` or use Maestro's platform-conditional configuration.
- The `smoke-play-audio.yaml` flow will fail until `testID="footer-player"` is added to `FooterPlayer.tsx` (change #1 above).
