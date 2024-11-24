import { PersistGate } from '@johnhamlin/redux-persist/integration/react';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import merge from 'deepmerge';
import { isRunningInExpoGo } from 'expo';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import { Provider as ReduxProvider, useSelector } from 'react-redux';

import { FooterPlayer } from '@/features/player/components';
import { useSetupPlayer } from '@/features/player/hooks/useSetupPlayer';
import { playbackService } from '@/features/player/services';
import { RootState, persistor, reduxStore } from '@/reduxStore';
import { listStyles } from '@/styles';

if (__DEV__) {
  // @ts-ignore
  import('ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

// Register the react-native-track-player playback service
TrackPlayer.registerPlaybackService(() => playbackService);

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: 'https://3ebc70c8d7760dbce1a08ea177938236@o4506599881834496.ingest.sentry.io/4506626395930624',
  // debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  integrations: [
    navigationIntegration,
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

export function RootLayout() {
  // Sentry for Expo Router
  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  // useEffect(() => {
  //   if (!AsyncStorage.getItem('isNotFirstLaunch')) {
  //     persistor.persist();
  //   }
  // }, [AsyncStorage.getItem('isNotFirstLaunch')]);

  // Get the theme based on the user's system preferences
  const theme = useCombinedTheme();

  // Setup react-native-track-player (once)
  useSetupPlayer();

  return (
    <ReduxProvider store={reduxStore}>
      {/* Disabling for now because it makes the initial load slow, and I'm not having UI issues with loading it because mmkv is so fast */}
      {/* <PersistGate
        // Obnoxious loading screen for debugging
        loading={
          <View style={listStyles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      > */}
      <PaperProvider theme={theme}>
        <ThemeProvider value={theme}>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen name="index" options={{}} />
              <Stack.Screen name="player" options={{ presentation: 'modal' }} />
            </Stack>
            <FooterPlayer />
          </SafeAreaProvider>
        </ThemeProvider>
      </PaperProvider>
      {/* </PersistGate> */}
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

export default Sentry.wrap(RootLayout);
