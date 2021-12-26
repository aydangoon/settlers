/**
 * An undirected, weighted, simple graph with a fixed number of nodes (created on initialization)
 * implemented with an adjacency list. The graph can store anything. **Note**, internally uses === to
 * check for equality.
 */
export class Graph<T> {
  /** Internal adjacency matrix */
  private al: [T, number][][]
  /** Internal mapping of an element to its index. Used to index adjacency list. */
  private keys: Map<T, number>

  /**
   * @param nodes A list of nodes that are in the graph.
   */
  constructor(nodes: T[])
  /**
   * @param edges A list of string tuples [a, b] representing
   * that an edge existing between a and b
   */
  constructor(edges: [T, T][])
  constructor(...args: any[]) {
    this.al = []
    this.keys = new Map<T, number>()
    if (Array.isArray(args[0][0])) {
      const edges = args[0] as [T, T][]
      for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i]
        if (u === v) continue
        if (this.hasNode(u)) {
          this.al[this.keyOf(u)].push([v, -1])
        } else {
          this.keys.set(u, this.al.length)
          this.al.push([[v, -1]])
        }
        if (this.hasNode(v)) {
          this.al[this.keyOf(v)].push([u, -1])
        } else {
          this.keys.set(v, this.al.length)
          this.al.push([[u, -1]])
        }
      }
    } else {
      const nodes: T[] = args[0] as T[]
      for (let i = 0; i < nodes.length; i++) {
        if (this.hasNode(nodes[i])) continue
        this.keys.set(nodes[i], this.al.length)
        this.al.push([])
      }
    }
  }

  private keyOf = (v: T): number => this.keys.get(v)!

  public hasNode = (v: T): boolean => this.keys.has(v)

  public hasEdge = (u: T, v: T) => {
    if (!this.hasNode(u)) return false
    for (let i = 0; i < this.al[this.keyOf(u)].length; i++) {
      if (this.al[this.keyOf(u)][i][0] === v) return true
    }
    return false
  }

  public addEdge(u: T, v: T, w: number = -1) {
    if (!this.hasNode(u) || !this.hasNode(v) || this.hasEdge(u, v)) return
    this.al[this.keyOf(u)].push([v, w])
    this.al[this.keyOf(v)].push([u, w])
  }

  public deleteEdge(u: T, v: T) {
    if (!this.hasNode(u) || !this.hasNode(v) || !this.hasEdge(u, v)) return
    this.al[this.keyOf(u)].splice(
      this.al[this.keyOf(u)].findIndex(([o]) => o === v),
      1
    )
    this.al[this.keyOf(v)].splice(
      this.al[this.keyOf(v)].findIndex(([o]) => o === u),
      1
    )
  }

  public getWeight(u: T, v: T) {
    if (!this.hasEdge(u, v)) return -1
    const li = this.al[this.keyOf(u)]
    for (let i = 0; i < li.length; i++) {
      if (li[i][0] === v) return li[i][1]
    }
    return -1
  }

  public setWeight(u: T, v: T, w: number) {
    if (!this.hasEdge(u, v)) return
    let li = this.al[this.keyOf(u)]
    li[li.findIndex(([o]) => o === v)][1] = w
    li = this.al[this.keyOf(v)]
    li[li.findIndex(([o]) => o === u)][1] = w
  }

  public degree = (u: T) => (this.hasNode(u) ? this.al[this.keyOf(u)].length : 0)

  public children = (u: T): T[] => {
    const children: T[] = []
    for (let i = 0; i < this.al[this.keyOf(u)].length; i++) {
      children.push(this.al[this.keyOf(u)][i][0])
    }
    return children
  }

  public nodeCount = (): number => this.al.length

  public nodes = (): T[] => [...this.keys.keys()]

  public edgeCount = () => {
    let count = 0
    const keys: T[] = [...this.keys.keys()]
    for (let i = 0; i < keys.length; i++) count += this.degree(keys[i])
    return Math.floor(count / 2)
  }
}

export default Graph
