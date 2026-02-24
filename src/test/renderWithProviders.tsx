import React, { type PropsWithChildren } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { mixtapeListApi } from '@/features/mixtapeList/slices/mixtapeListApi';
import playerReducer from '@/features/player/slice/playerSlice';

import type { RootState } from '@/reduxStore';

type AppStore = ReturnType<typeof createTestStore>;

const activeStores: AppStore[] = [];

interface RenderWithProvidersOptions extends RenderOptions {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      [mixtapeListApi.reducerPath]: mixtapeListApi.reducer,
      player: playerReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(mixtapeListApi.middleware),
    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers({ autoBatch: false }),
    preloadedState: preloadedState as RootState,
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const { preloadedState, store = createTestStore(preloadedState), ...renderOptions } = options;
  activeStores.push(store);

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <ReduxProvider store={store}>
        <PaperProvider>
          <SafeAreaProvider
            initialMetrics={{
              frame: { x: 0, y: 0, width: 0, height: 0 },
              insets: { top: 0, left: 0, right: 0, bottom: 0 },
            }}
          >
            {children}
          </SafeAreaProvider>
        </PaperProvider>
      </ReduxProvider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

afterEach(async () => {
  for (const store of activeStores) {
    store.dispatch(mixtapeListApi.util.resetApiState());
  }
  activeStores.length = 0;
  await new Promise(resolve => setTimeout(resolve, 0));
});
