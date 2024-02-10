import * as FileSystem from 'expo-file-system';
import { LRUCache } from 'lru-cache';

// const songCache = new LRUCache<string, string>({
//   max: 100,
//   maxSize: 1024 * 1024 * 50, // 50MB
// });

export async function saveSong(
  identifier: string,
  folder: string,
  song: string,
): Promise<string | void> {
  const path = `${FileSystem.documentDirectory}${folder}/${identifier}`;
  try {
    await FileSystem.writeAsStringAsync(path, song);
    return path;
    // songCache.set(identifier, song);
  } catch (error) {
    console.error(error);
  }
}

// ? This may need to take a path instead of an identifier and folder
export async function deleteSong(
  identifier: string,
  folder: string,
): Promise<void> {
  try {
    await FileSystem.deleteAsync(
      `${FileSystem.documentDirectory}${folder}/${identifier}`,
    );
    // songCache.dispose(identifier);
  } catch (error) {
    console.error(error);
  }
}
