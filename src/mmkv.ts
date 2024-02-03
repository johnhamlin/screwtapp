import { Storage } from '@johnhamlin/redux-persist/es/types';
import { MMKV } from 'react-native-mmkv';

export const MmkvStorage = new MMKV();

export const reduxMmkvStorage: Storage = {
  setItem: (key, value) => {
    MmkvStorage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = MmkvStorage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    MmkvStorage.delete(key);
    return Promise.resolve();
  },
  // Added this to fix type error
  getAllKeys: () => {
    const allKeys = MmkvStorage.getAllKeys();
    return Promise.resolve(allKeys);
  },
};
