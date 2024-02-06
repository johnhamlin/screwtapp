import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from '@johnhamlin/redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { reduxMmkvStorage } from './mmkv';

import { mixtapeListApi } from '@/features/mixtapeList/slices/mixtapeListApi';
import playerReducer from '@/features/player/slices/playerSlice';

const persistConfig = {
  key: 'root',
  storage: reduxMmkvStorage,
  log: true,
  // Don't wait for the PersistGate if it's the first launch
  //   timeout: (async () =>
  //     (await AsyncStorage.getItem('isNotFirstLaunch')) ? 5000 : 0)(),
};
console.log('setting up redux store');

// Combine the reducers so they can be persisted
const rootReducer = combineReducers({
  [mixtapeListApi.reducerPath]: mixtapeListApi.reducer,
  player: playerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = configureStore({
  reducer: persistedReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(mixtapeListApi.middleware),
  enhancers: getDefaultEnhancers =>
    __DEV__
      ? getDefaultEnhancers().concat(
          require('../ReactotronConfig').default.createEnhancer(),
        )
      : getDefaultEnhancers(),
});

// TODO: This may need to be a let
export const persistor = persistStore(reduxStore);

// Mark that the app has been launched at least once
// (async () =>
//   (await AsyncStorage.getItem('isNotFirstLaunch'))
//     ? null
//     : AsyncStorage.setItem('isNotFirstLaunch', 'true'))();

setupListeners(reduxStore.dispatch);

// Infer the `RootState` types
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type
export type AppDispatch = typeof reduxStore.dispatch;
