import { mixtapeListApi } from '@/features/mixtapeList/slices/mixtapeListApi';
import playerReducer from '@/features/player/slices/playerSlice';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// ! Must Comment this line out for preview/production build
import Reactotron from '../ReactotronConfig';

export const store = configureStore({
  reducer: {
    [mixtapeListApi.reducerPath]: mixtapeListApi.reducer,
    player: playerReducer,
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(mixtapeListApi.middleware),
  // ! Must Comment out these lines for preview/production build
  enhancers: getDefaultEnhancers =>
    getDefaultEnhancers().concat(Reactotron.createEnhancer()),
});

// export let store: EnhancedStore;

// let Reactotron: any;
// (async () => {
//   if (__DEV__) {
//     Reactotron = await import('../ReactotronConfig');
//   }
// })();

// if (__DEV__) {
//   const Reactotron: any = (async () => await import('../ReactotronConfig'))();

// await import('../ReactotronConfig');

// } else {
//   store = configureStore({
//     reducer: {
//       [mixtapeListApi.reducerPath]: mixtapeListApi.reducer,
//       player: playerReducer,
//     },

//     // Adding the api middleware enables caching, invalidation, polling,
//     // and other useful features of `rtk-query`.
//     middleware: getDefaultMiddleware =>
//       getDefaultMiddleware().concat(mixtapeListApi.middleware),
//   });
// }

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
