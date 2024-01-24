import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../model/redux/store';
import { Slot, useNavigationContainerRef } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import * as Sentry from '@sentry/react-native';
import { useEffect } from 'react';

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: 'https://3ebc70c8d7760dbce1a08ea177938236@o4506599881834496.ingest.sentry.io/4506626395930624',
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      // ...
    }),
  ],
});

function RootLayout() {
  // Sentry for Expo Router
  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  console.log({ colorScheme });

  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}

export default Sentry.wrap(RootLayout);
