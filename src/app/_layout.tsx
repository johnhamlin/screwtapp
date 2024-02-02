import '@/styles/global.css';

import { PersistGate } from '@johnhamlin/redux-persist/integration/react';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import merge from 'deepmerge';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Text,
  adaptNavigationTheme,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';
import { Provider as ReduxProvider } from 'react-redux';

import { FooterPlayer } from '@/features/player/components';
import { PlaybackService, SetupService } from '@/features/player/services';
import { persistor, store } from '@/redux-store';

if (__DEV__) {
  // @ts-ignore
  import('ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

// Register the react-native-track-player playback service
TrackPlayer.registerPlaybackService(() => PlaybackService);

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
Sentry.init({
  dsn: 'https://3ebc70c8d7760dbce1a08ea177938236@o4506599881834496.ingest.sentry.io/4506626395930624',
  // debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      // ...
    }),
  ],
});

export function RootLayout() {
  // Sentry for Expo Router
  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  // Get the theme based on the user's system preferences
  const theme = useCombinedTheme();

  // Setup react-native-track-player (once)
  useSetupPlayer();

  return (
    <ReduxProvider store={store}>
      <PersistGate
        loading={
          <View
            style={{ backgroundColor: 'red', height: '100%', width: '100%' }}
          >
            <Text>Loading…</Text>
          </View>
        }
        persistor={persistor}
      >
        <PaperProvider theme={theme}>
          <ThemeProvider value={theme}>
            <SafeAreaProvider>
              <Stack>
                <Stack.Screen name="index" options={{}} />
                <Stack.Screen
                  name="player"
                  options={{ presentation: 'modal', headerShown: false }}
                />
              </Stack>
              <FooterPlayer />
            </SafeAreaProvider>
          </ThemeProvider>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

function useCombinedTheme() {
  //  Merge the Material Design 3 theme with any Android user customizations
  const { theme: androidCustomTheme } = useMaterial3Theme();
  const MD3DefaultThemeWithAndroidCustomization = {
    ...MD3LightTheme,
    ...androidCustomTheme.light,
  };
  const MD3DarkThemeWithAndroidCustomization = {
    ...MD3DarkTheme,
    ...androidCustomTheme.dark,
  };

  // Adapt the Material Design 3 theme to React Navigation
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  // Merge the Material Design 3 theme with the React Navigation theme
  const CombinedDefaultTheme = merge(
    MD3DefaultThemeWithAndroidCustomization,
    LightTheme,
  );
  const CombinedDarkTheme = merge(
    MD3DarkThemeWithAndroidCustomization,
    DarkTheme,
  );

  // Set the light or dark theme based on the system preference
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
}

function useSetupPlayer() {
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await SetupService();
      if (unmounted) return;
      setPlayerReady(true);
      // const queue = await TrackPlayer.getQueue();
      // if (unmounted) return;
      // if (queue.length <= 0) {
      //   await QueueInitialTracksService();
      // }
    })();
    return () => {
      unmounted = true;
    };
  }, []);
  return playerReady;
}

export default Sentry.wrap(RootLayout);
