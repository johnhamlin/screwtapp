import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { MMKV } from 'react-native-mmkv';
import { persistStore, Storage } from 'redux-persist';

import { mixtapeListApi } from '@/features/mixtapeList/slices/mixtapeListApi';
import playerReducer from '@/features/player/slices/playerSlice';

const storage = new MMKV();

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

export const store = configureStore({
  reducer: {
    [mixtapeListApi.reducerPath]: mixtapeListApi.reducer,
    player: playerReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(mixtapeListApi.middleware),
  enhancers: getDefaultEnhancers =>
    __DEV__
      ? getDefaultEnhancers().concat(
          require('../ReactotronConfig').default.createEnhancer(),
        )
      : getDefaultEnhancers(),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
