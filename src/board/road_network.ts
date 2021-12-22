import { NUM_NODES } from '../constants'

export interface LongestRoad {
  player: number
  length: number
}

interface Connection {
  id: number
  player: number
}

/**
 * A data structure that manages the board road/structure network.
 * This is **not** a generic graph data structure. A `RoadNetwork`
 * provides a rigid, simple interface related for what the board needs
 * and implements all underlying graph algs under the hood.
 */
export class RoadNetwork {
  private connections: Connection[][]

  constructor() {
    this.connections = [...Array(NUM_NODES)].map(() => [])

    // Establish our connections.
    const rowSize = [7, 9, 11, 11, 9, 7] // nodes per row
    const downOffset = [8, 10, 11, 10, 8]

    let col = 0
    let row = 0
    for (let i = 0; i < NUM_NODES; i++) {
      // establish the connection between node and its right node
      if (col + 1 !== rowSize[row]) {
        this.addConnection(i, i + 1)
      }
      // establish the conneciton between node and its downward node
      if (row < 3 && col % 2 == 0) {
        this.addConnection(i, i + downOffset[row])
      } else if ((row == 3 || row == 4) && col % 2 == 1) {
        this.addConnection(i, i + downOffset[row])
      }

      col++
      if (col == rowSize[row]) {
        col = 0
        row++
      }
    }
  }

  private children = (nid: number) => this.connections[nid].map(({ id }) => id)

  private addConnection(nid0: number, nid1: number) {
    if (this.hasConnection(nid0, nid1)) return
    this.connections[nid0].push({ id: nid1, player: -1 })
    this.connections[nid1].push({ id: nid0, player: -1 })
  }

  private hasConnection(nid0: number, nid1: number): boolean {
    return this.connections[nid0].find((conn) => conn.id === nid1) !== undefined
  }

  private setConnectionPlayer(nid0: number, nid1: number, player: number) {
    if (!this.hasConnection(nid0, nid1)) return
    const conn0 = this.connections[nid0].find((conn) => conn.id === nid1)
    const conn1 = this.connections[nid1].find((conn) => conn.id === nid0)
    conn0!.player = player
    conn1!.player = player
  }

  private getConnectionPlayer(nid0: number, nid1: number): number {
    const conn = this.connections[nid0].find((conn) => conn.id === nid1)
    return conn !== undefined ? conn.player : -1
  }

  /**
   * Build a road for player number `player`, if one doesn't already
   * exist, between nodes `nid0` and `nid1`.
   * @param nid0 First node.
   * @param nid1 Second node.
   * @param player The player number.
   */
  public buildRoad(nid0: number, nid1: number, player: number): void {
    if (
      this.hasConnection(nid0, nid1) &&
      this.getConnectionPlayer(nid0, nid1) === -1
    ) {
      this.setConnectionPlayer(nid0, nid1, player)
    }
  }
  /**
   * @param nid0 First node.
   * @param nid1 Second node.
   * @returns The player number that owns the road, -1 if no owner or the nodes
   * aren't connected.
   */
  public getRoad(nid0: number, nid1: number): number {
    return this.getConnectionPlayer(nid0, nid1)
  }

  /**
   * Get a list of node ids adjacent to `nid`.
   * @param nid The node id to check adjacency to.
   * @returns A list of adjacent node ids.
   */
  public adjacentTo(nid: number): number[] {
    return this.children(nid)
  }

  /**
   * Calculates and returns the longest road.
   * @returns a `LongestRoad` object.
   */
  public getLongestRoad(): LongestRoad {
    // LongestRoad(ConnectedComponent) High Level Algorithm

    /**
     * Case 0: no odd-degree nodes.
     * In this case eulerian cycle exists so just return the number of edges.
     */

    /**
     * Case 1: 2 odd-degree nodes
     * In this case same as case 1, eulerian path exists so just return the
     * number of edges.
     */

    /**
     * Case 2: 2k (for int k > 1) odd-degree nodes.
     *
     * Case 2a: There are no nodes with degree 3.
     *  1. Pick a node with degree 1 and run BFS.
     *  2. Return the length of the longest path.
     *
     * Case 2b. There is a node with degree 3.
     *  1. Pick a starting node with degree 3.
     *  2. Look for a cycle (use BFS to ensure it is minimal).
     *  2a. If no cycle, go to Case 2a.
     *  2b. If cycle found, it will be of size 6 (bc hexagonal tiles).
     *  3. Delete every edge on the cycle.
     *  4. Delete every node that now has degree 0
     *  5. For every node that was on that cycle and now has degree 1 (so
     *     every node on the cycle that wasn't deleted in step 4) mark it
     *     as "LENGTH 6"
     *  6. Repeat
     */

    // TODO: implement
    return { player: 0, length: 0 }
  }
}

export default RoadNetwork
