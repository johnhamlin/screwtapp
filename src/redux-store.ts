import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

import { reduxStorage } from './mmkv';

import { mixtapeListApi } from '@/features/mixtapeList/slices/mixtapeListApi';
import playerReducer from '@/features/player/slices/playerSlice';

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
};
console.log('setting up redux store');

// Combine the reducers so they can be persisted
const reducers = combineReducers({
  [mixtapeListApi.reducerPath]: mixtapeListApi.reducer,
  player: playerReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
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
export const persistor = persistStore(store);

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
