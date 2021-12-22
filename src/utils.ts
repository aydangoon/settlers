/**
 * Defines a set of utility functions & classes for logic for math, strings, etc.
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

/**
 * An undirected, unweighted, simple graph with a fixed maximum
 * number of nodes on initialization and implemented with
 * an adjacency matrix. Nodes are numbers.
 */
export class Graph {
  /** Internal adjacency matrix */
  private mat: boolean[][]

  /**
   *
   * @param edges A list of string tuples [a, b] representing
   * that an edge existing between a and b
   */
  constructor(edges: [string, string][]) {
    let index = 0
    const idMap: { [key: string]: number } = {}

    // Count number of unique nodes.
    edges.forEach(([u, v]) => {
      if (!(u in idMap)) idMap[u] = index++
      if (!(v in idMap)) idMap[v] = index++
    })

    // Instantiate mat to all false.
    this.mat = [...Array(index)].map(() => [...Array(index)].map(() => false))

    // Add each edge.
    edges.forEach(([u, v]) => {
      this.mat[idMap[u]][idMap[v]] = true
      this.mat[idMap[v]][idMap[u]] = true
    })
  }

  public hasEdge = (u: number, v: number) => this.mat[u][v]

  public addEdge(u: number, v: number) {
    this.mat[u][v] = true
    this.mat[v][u] = true
  }

  public deleteEdge(u: number, v: number) {
    this.mat[u][v] = false
    this.mat[v][u] = false
  }

  public degree = (u: number) =>
    this.mat[u].reduce((acc, curr) => acc + (curr ? 1 : 0), 0)

  public children = (u: number): number[] => {
    const children: number[] = []
    this.mat[u].forEach((elt, i) => {
      if (elt) children.push(i)
    })
    return children
  }
  public size = () => this.mat.length

  public edgeCount = () => {
    let count = 0
    for (let i = 0; i < this.mat.length; i++) {
      count += this.degree(i)
    }
    return Math.floor(count / 2)
  }
}

export const connectedComponents = (g: Graph): number[][] => {
  let remaining = [...Array(g.size())].map((_, i) => i)
  const ccs: number[][] = []
  while (remaining.length > 0) {
    const src = remaining[0]
    const { visited } = breadthFirstSearch(g, src)
    ccs.push([...visited])
    remaining = remaining.filter((elt) => !visited.has(elt))
  }
  return ccs
}

export const findCycle = (
  g: Graph,
  src: number,
  hasSubset: boolean = false,
  subset: Set<number> = new Set<number>()
) => {
  const visited = new Set<number>()
  const parent: { [key: number]: number } = { [src]: -1 }
  return cycleHelper(g, src, hasSubset, subset, visited, parent)
}

const cycleHelper = (
  g: Graph,
  curr: number,
  hasSubset: boolean,
  subset: Set<number>,
  visited: Set<number>,
  parent: { [key: number]: number }
): number[] | null => {
  visited.add(curr)
  const children = g.children(curr)
  //console.log('on', curr, children)
  for (let i = 0; i < children.length; i++) {
    if (children[i] === parent[curr]) continue
    if (hasSubset && !subset.has(children[i])) continue
    if (visited.has(children[i])) {
      const cycle = []
      do {
        cycle.push(curr)
        curr = parent[curr]
      } while (curr !== children[i])
      cycle.push(children[i])
      return cycle
    }
    parent[children[i]] = curr
    let res = cycleHelper(g, children[i], hasSubset, subset, visited, parent)
    if (res !== null) return res
  }
  return null
}

export interface BFSTraveral {
  visited: Set<number>
  depth: number
}

export const breadthFirstSearch = (
  g: Graph,
  src: number,
  hasSubset: boolean = false,
  subset: Set<number> = new Set<number>()
): BFSTraveral => {
  const queue = [src]
  const visited = new Set<number>([src])
  const depths: { [key: number]: number } = { [src]: 0 }

  while (queue.length > 0) {
    const curr = queue.pop()
    const children = g.children(curr!)
    for (let i = 0; i < children.length; i++) {
      if ((hasSubset && !subset.has(children[i])) || visited.has(children[i])) {
        continue
      }
      queue.unshift(children[i])
      visited.add(children[i])
      depths[children[i]] = depths[curr!] + 1
    }
  }

  return {
    visited,
    depth: Math.max(...Object.keys(depths).map((k) => depths[parseInt(k)])),
  }
}
