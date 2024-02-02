import { Storage } from '@johnhamlin/redux-persist/es/types';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

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
  // Added this to fix type error
  getAllKeys: () => {
    const allKeys = storage.getAllKeys();
    return Promise.resolve(allKeys);
  },
};
