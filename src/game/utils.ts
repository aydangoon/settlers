/**
 * Defines a set of utility functions & classes for logic for math, strings, etc.
 * @module
 */

import Graph from './board/graph'

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

/**
 * A recursive helper function to find the max trail.
 * @param v The current node.
 * @param g The graph.
 * @param seen A list of edges already visited.
 * @returns The length of the max trail.
 */
export function maxTrailRec<T>(v: T, g: Graph<T>, seen: Graph<T>): number {
  const choices = g.children(v).filter((other) => !seen.hasEdge(v, other))
  if (choices.length === 0) return 0
  let u: T, ret: number
  u = choices[0]
  seen.addEdge(u, v)
  ret = 1 + maxTrailRec(u, g, seen)
  seen.deleteEdge(u, v)
  if (choices.length === 2) {
    u = choices[1]
    seen.addEdge(u, v)
    ret = Math.max(ret, 1 + maxTrailRec(u, g, seen))
    seen.deleteEdge(u, v)
  }
  return ret
}

/**
 * maxTrail explores every possible trail that starts at node `src` and
 * return the max length of all trials.
 * @param g The graph.
 * @param src The starting node.
 */
export const maxTrail = <T>(g: Graph<T>, src: T): number => {
  const seen = new Graph<T>(g.nodes())
  return maxTrailRec(src, g, seen)
}

/**
 * Get a list of graphs that are the connected components of graph `g`.
 * @param g The graph.
 * @returns A list of ccs.
 */
export const connectedComponents = <T>(g: Graph<T>): Graph<T>[] => {
  let remaining = g.nodes()
  const ccs: Graph<T>[] = []
  while (remaining.length > 0) {
    const src = remaining[0]
    const { visited } = breadthFirstSearch(g, src)
    const li = [...visited]
    const cc = new Graph<T>(li)

    for (let i = 0; i < li.length; i++) {
      for (let j = i + 1; j < li.length; j++) {
        if (g.hasEdge(li[i], li[j])) cc.addEdge(li[i], li[j])
      }
    }
    ccs.push(cc)
    remaining = remaining.filter((elt) => !visited.has(elt))
  }
  return ccs
}

export interface BFSTraveral<T> {
  visited: Set<T>
  depth: number
}

/**
 * Run BFS on a graph from a source.
 * @param g The graph.
 * @param src The source elt.
 * @returns A BFS traversal object that includes a list of visited graph elts
 * and the max depth of the BFS tree.
 */
export const breadthFirstSearch = <T>(g: Graph<T>, src: T): BFSTraveral<T> => {
  const queue = [src]
  const visited = new Set<T>([src])
  const depths = new Map<T, number>()
  depths.set(src, 0)

  while (queue.length > 0) {
    const curr: T = queue.pop()!
    const children = g.children(curr)
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (visited.has(child)) continue
      queue.unshift(child)
      visited.add(child)
      depths.set(child, depths.get(curr)! + 1)
    }
  }

  return {
    visited,
    depth: Math.max(...depths.values()),
  }
}
