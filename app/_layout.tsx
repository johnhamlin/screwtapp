import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../model/redux/store';
import { Slot } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';

export default function Layout() {
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
