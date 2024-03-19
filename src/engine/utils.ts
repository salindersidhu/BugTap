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
export function getRandomItem<T>(itemArray: T[]): T | undefined {
  itemArray = itemArray || [];
  return itemArray[Math.floor(Math.random() * itemArray.length)];
}

/**
 * Return an array of objects that is randomly shuffled.
 *
 * @param itemArray An array of objects.
 * @returns An array of objects from itemArray shuffled.
 */
export function shuffle<T>(itemArray: T[]): T[] {
  itemArray = itemArray || [];
  return itemArray.sort(() => Math.random() - 0.5);
}
