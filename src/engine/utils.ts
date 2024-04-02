/**
 * Return a random number between min and max inclusive.
 *
 * @param min The minimum value for the random number.
 * @param max The maximum value for the random number.
 * @returns A random number between min and max inclusive.
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return a random object from itemArray.
 *
 * @param itemArray An array of objects.
 * @returns A random object from itemArray.
 */
export function getRandomItem<T>(itemArray: T[]): T {
  itemArray = itemArray || [];
  return itemArray[Math.floor(Math.random() * itemArray.length)];
}

/**
 * Add or update a value in the store with the specified key.
 *
 * @param key The key to store the value under.
 * @param value The value to be stored.
 */
export function setToStore(key: string, value: string) {
  localStorage.setItem(key, value);
}

/**
 * Fetch a value from the store with the specified key.
 *
 * @param key The key of the value to retrieve.
 * @returns The value stored under the key, or null if the key does not exist.
 */
export function getFromStore(key: string): string | null {
  return localStorage.getItem(key);
}

/**
 * Remove a value from the store with the specified key.
 *
 * @param key The key of the value to remove.
 */
export function removeFromStore(key: string) {
  localStorage.removeItem(key);
}

/**
 * Remove all values stored in the store.
 */
export function clearStore() {
  localStorage.clear();
}

/**
 * Format the given number of seconds into a string representation of minutes
 * and seconds (MM:SS).
 *
 * @param seconds The number of seconds to format.
 * @returns A string representing the formatted time in minutes and seconds (MM:SS).
 */
export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${paddedSeconds}`;
}

/**
 * Returns objects of a specific type from an array.
 *
 * @template T The type of objects to fetch.
 * @param array The array of objects to filter.
 * @param type The constructor representing the type of objects.
 * @returns An array of objects of the specified type.
 */
export function filterObjectsByType<T>(
  array: any[] | undefined,
  type: new (...args: any[]) => T
): T[] {
  // Check if array is defined and is an array
  if (!Array.isArray(array)) {
    return [];
  }

  return array.filter((item) => item instanceof type) as T[];
}
