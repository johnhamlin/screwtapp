import * as FileSystem from 'expo-file-system';
import { LRUCache } from 'lru-cache';

const songCache = new LRUCache<string, string>({
  max: 100,
  maxSize: 1024 * 1024 * 50, // 50MB
});
