/**
 * Defines a set of utility functions for logic for math, strings, etc.
 * @module
 */

/**
 * Returns a index from a weighted array.
 * @param weights An array of weights
 * @return The index to remove or -1 if no such index if weights are 0 or
 * array is empty.
 */
export const weightedRandom = (weights: number[]) => {
  const sum = weights.reduce((acc, curr) => acc + curr)
  let value = Math.random() * sum
  for (let i = 0; i < weights.length; i++) {
    value -= weights[i]
    if (value <= 0) return i
  }
  return -1
}

/**
 * Roll a die.
 * @returns A uniform int on [1, 6]
 */
export const rollDie = () => uniformRandom(1, 6)

/**
 * @returns A uniform int on [lo, hi]
 */
export const uniformRandom = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo
