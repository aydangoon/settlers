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

    // TODO: Fill connections
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
    return { player: 0, length: 0 }
  }
}

export default RoadNetwork