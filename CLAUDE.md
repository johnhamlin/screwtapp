# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScrewTapp is a React Native (Expo 54, RN 0.81) app for browsing and playing DJ Screw mixtapes from Archive.org. It runs on iOS and Android with New Architecture (Fabric/TurboModules) enabled.

## Commands

- `npm run start` — Start Expo dev server
- `npm run ios` — Run on iOS
- `npm run android` — Run on Android
- `npm run ts:check` — TypeScript type checking (strict mode)
- `npm run lint` — ESLint
- `npm run preview:ios` — Local EAS build for iOS (preview profile)
- `npm run preview:android` — Local EAS build for Android (preview profile)

There is no test runner configured.

## Architecture

### Routing

Expo Router (file-based routing) in `src/app/`:
- `/` (`index.tsx`) — Mixtape list (home screen)
- `/mixtape/[id]` — Track list for a specific mixtape
- `/player` (`player.tsx`) — Full-screen player modal

### State Management

Redux Toolkit + RTK Query, persisted via MMKV:
- **Store**: `src/reduxStore.ts` — combines `mixtapeListApi` (RTK Query) and `player` (slice) reducers, wraps with redux-persist using a custom MMKV adapter (`src/mmkv.ts`)
- **Typed hooks**: `src/hooks/reduxHooks.ts` — `useAppDispatch`, `useAppSelector`

### Feature Organization

Features are self-contained under `src/features/`:

**`mixtapeList/`** — RTK Query API for Archive.org (`slices/mixtapeListApi.ts`):
- `getMixtapeList` — fetches collection listing via Archive.org scrape API
- `getMixtape` — fetches metadata/tracks for a single mixtape, transforms to RNTP Track format

**`player/`** — Audio playback via react-native-track-player:
- `slice/` — Redux state (queue, current track, player ready state)
- `services/` — TrackPlayer setup, playback event handling, queue management
- `components/` — FooterPlayer (mini player), PlayerControls, Progress, TrackInfo
- `hooks/useSetupPlayer.tsx` — one-time player initialization

### Theming

Material Design 3 with system light/dark mode. The theme pipeline in `src/app/_layout.tsx`:
1. MD3 base theme (react-native-paper)
2. Android Material3 customization (`@pchmn/expo-material3-theme`)
3. Adapted for React Navigation via `adaptNavigationTheme`
4. Deep-merged into a combined theme, selected by `useColorScheme()`

### Key Dependencies

- **UI**: react-native-paper (MD3), @shopify/flash-list
- **Audio**: react-native-track-player v5 (RNTP, New Arch compatible)
- **Storage**: react-native-mmkv v4 (Nitro Modules, persistence adapter for redux-persist)
- **Monitoring**: @sentry/react-native
- **Dev**: Reactotron (Redux + MMKV + networking inspection, loaded only in `__DEV__`)

## Conventions

- **Path alias**: `@/*` maps to `src/*` (configured in tsconfig.json)
- **TypeScript**: Strict mode enabled. Global types in `src/@types/global.d.ts` (`Mixtape`, `MixtapeTrack`). Feature-specific API types colocated in feature `@types/` dirs.
- **Formatting**: Prettier with single quotes, no parens on single-param arrows
- **Unused vars**: Prefix with `_` to suppress lint warnings
