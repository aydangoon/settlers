import {
  HAVE_PORTS,
  NUM_EACH_RESOURCE_TILE,
  NUM_EDGES,
  NUM_NODES,
  NUM_RESOURCE_TYPES,
  NUM_TILES,
} from '../constants'
import Node from './node'
import Tile from './tile'
import { connectedComponents, maxTrail, weightedRandom } from '../utils'
import Graph from './graph'
import Port from './port'
import Resource from '../resource/resource'
import Loggable from '../loggable'

/**
 * A game board. The board manages the internal logic
 * for the underlying undirected graph and its own state.
 * It is **agnostic** of game state and will never check if
 * a call to its public interface violates game state.
 */
export class Board implements Loggable {
  /** List of node objects, indexable by node number. */
  readonly nodes: Node[]
  /** Graph of nodes. Edge weight -1 indicates connection edge weight > -1 indicates road
   * for the player number of that weight.
   */
  readonly roadnetwork: Graph<number>
  /** List of tiles objects indexable by tile number. */
  readonly tiles: Tile[]
  /** The tile number the robber is on. */
  public robber: number = -1

  constructor() {
    this.roadnetwork = this.generateRoadNetwork()
    this.nodes = this.generateNodes()
    this.tiles = this.generateTiles() // Generate tiles & set robber.
  }

  private generateRoadNetwork() {
    const g = new Graph<number>([...Array(NUM_NODES)].map((_, i) => i))

    // Establish our connections.
    const rowSize = [7, 9, 11, 11, 9, 7] // nodes per row
    const downOffset = [8, 10, 11, 10, 8]

    let col = 0
    let row = 0
    for (let i = 0; i < NUM_NODES; i++) {
      // establish the connection between node and its right node
      if (col + 1 !== rowSize[row]) {
        g.addEdge(i, i + 1)
      }
      // establish the conneciton between node and its downward node
      if (row < 3 && col % 2 == 0) {
        g.addEdge(i, i + downOffset[row])
      } else if ((row == 3 || row == 4) && col % 2 == 1) {
        g.addEdge(i, i + downOffset[row])
      }

      col++
      if (col == rowSize[row]) {
        col = 0
        row++
      }
    }
    return g
  }

  private generateNodes() {
    const nodes: Node[] = [...Array(NUM_NODES)].map(() => new Node())

    // Assign ports randomly.
    const ports: number[] = [...Array(NUM_RESOURCE_TYPES + 1)].map(() => 1)
    ports[NUM_RESOURCE_TYPES] = 4 // Set 3:1 ports.

    for (let i = 0; i < HAVE_PORTS.length; i++) {
      const [node0, node1]: [number, number] = HAVE_PORTS[i]
      const index = weightedRandom(ports)
      ports[index]--
      let port: Port
      if (index === NUM_RESOURCE_TYPES) {
        port = new Port([...Array(NUM_RESOURCE_TYPES).keys()], 3)
      } else {
        port = new Port([index as Resource], 2)
      }
      nodes[node0].setPort(port)
      nodes[node1].setPort(port)
    }

    return nodes
  }

  private generateTiles() {
    const tiles: Tile[] = new Array(NUM_TILES)

    const resources: number[] = [...NUM_EACH_RESOURCE_TILE, 1] // The 1 is for None (desert)

    // Make tile objects. lmao wish i was good at math
    const rowSize = [3, 4, 5, 4, 3]
    const rowFirstNid = [0, 7, 16, 28, 39]
    const rowNidOffset = [8, 10, 11, 10, 8]

    let row = 0
    let col = 0
    for (let i = 0; i < NUM_TILES; i++) {
      // Select a random resource for this tile.
      const index = weightedRandom(resources)
      resources[index]--

      // Calculate the node ids of of its nodes.
      const nid = 2 * col + rowFirstNid[row]
      const offset = nid + rowNidOffset[row]
      const nids = [nid, nid + 1, nid + 2, offset, offset + 1, offset + 2]

      tiles[i] = new Tile(index as Resource, nids)

      col++
      // We should update to the next row.
      if (col == rowSize[row]) {
        col = 0
        row++
      }
    }

    // Distribute tokens.

    // Number number token `i` is `tokens[i - 2]`
    const temp = [1, 2, 2, 2, 2]
    const tokens = [...temp, 0, ...temp.reverse()]
    // Distribute 6s and 8s first to ensure seperation.

    const choosable: number[] = [...Array(NUM_TILES).keys()].map((i) =>
      tiles[i].resource !== Resource.None ? 1 : 0
    )
    for (let i = 0; i < 4; i++) {
      const index = weightedRandom(choosable)
      const number = tokens[4] > 0 ? 6 : 8
      tiles[index].setNumber(number)
      tokens[number - 2]--

      for (let j = 0; j < choosable.length; j++) {
        if (choosable[j] === 1 && tiles[index].isAdjacentTo(tiles[j])) {
          choosable[j] = 0
        }
      }
    }

    // Distribute the rest of the tokens.
    for (let i = 0; i < NUM_TILES; i++) {
      if (tiles[i].getNumber() !== -1) continue

      // If None (desert), index is 5 since number is 7. Otherwise
      // do a weighted random pick.
      const index = tiles[i].resource !== Resource.None ? weightedRandom(tokens) : 5

      tiles[i].setNumber(index + 2)

      // If tile is desert, also just set the robber.
      if (tiles[i].resource === Resource.None) {
        this.robber = i
      } else {
        tokens[index]--
      }
    }

    return tiles
  }

  /**
   * Given a connected graph g find its longest trail.
   * @param g The graph. Every node degree is on [0, 3].
   * @returns The length of the longest trail.
   */
  private longestRoadOn(g: Graph<string>): number {
    const oddDeg = []
    const nodes = g.nodes()
    for (let i = 0; i < nodes.length; i++) {
      if (g.degree(nodes[i]) % 2 === 1) oddDeg.push(nodes[i])
    }
    // If at most 2 odd-degree, eulerian path exists, just return edgeCount.
    return oddDeg.length <= 2 ? g.edgeCount() : Math.max(...oddDeg.map((i) => maxTrail(g, i)))
  }

  /**
   * Calculates the longest road length of player `player`.
   * @param player The player number to check.
   * @returns Length in number of roads.
   */
  public getLongestRoad(player: number): number {
    // Step 0: Preprocessing. Convert player's roads into a graph.

    const edges: [string, string][] = [] // edges to add to our graph.

    for (let i = 0; i < NUM_NODES; i++) {
      const node: Node = this.nodes[i]
      // Check right.
      if (this.roadnetwork.getWeight(i, i + 1) === player) {
        if (!node.isEmpty() && node.getPlayer() !== player) {
          edges.push([`${i}_l`, `${i + 1}`])
        } else if (!this.nodes[i + 1].isEmpty() && this.nodes[i + 1].getPlayer() !== player) {
          edges.push([`${i}`, `${i + 1}_r`])
        } else {
          edges.push([`${i}`, `${i + 1}`])
        }
      }
      // Check down
      const below = this.roadnetwork.children(i).filter((id) => id > i + 1)[0]
      if (below !== undefined && this.roadnetwork.getWeight(i, below) === player) {
        if (!node.isEmpty() && node.getPlayer() !== player) {
          edges.push([`${i}_u`, `${below}`])
        } else if (!this.nodes[below].isEmpty() && this.nodes[below].getPlayer() !== player) {
          edges.push([`${i}`, `${below}_d`])
        } else {
          edges.push([`${i}`, `${below}`])
        }
      }
    }

    const ccs: Graph<string>[] = connectedComponents(new Graph<string>(edges))
    return Math.max(0, ...ccs.map((cc) => this.longestRoadOn(cc)))
  }

  /**
   * Get players who can be robbed.
   * @returns List of player numbers who have structures on nodes incident on
   * the robber tile.
   */
  public playersOnRobber(): number[] {
    return this.robber !== -1
      ? [
          ...new Set(
            this.tiles[this.robber].nodes
              .filter((nid) => !this.nodes[nid].isEmpty())
              .map((nid) => this.nodes[nid].getPlayer())
          ),
        ]
      : []
  }

  /**
   * Build a road for player number `player`, if one doesn't already
   * exist, between nodes `nid0` and `nid1`.
   * @param nid0 First node.
   * @param nid1 Second node.
   * @param player The player number.
   */
  public buildRoad(nid0: number, nid1: number, player: number) {
    this.roadnetwork.setWeight(nid0, nid1, player)
  }

  /**
   * Get the player number for a road between two nodes.
   * @param nid0 First node.
   * @param nid1 Second node.
   * @returns -1 If no road or if the nodes aren't adjacent. The player number
   * of the road otherwise.
   */
  public getRoad(nid0: number, nid1: number) {
    return this.roadnetwork.getWeight(nid0, nid1)
  }

  /**
   * Get all adjacent nodes.
   * @param nid The node id we want to get the adjacent nodes for.
   * @returns List of adjacent node ids.
   */
  public adjacentTo = (nid: number) => this.roadnetwork.children(nid)

  toLog = () => {
    const max = 11
    const rowSize = [max - 4, max - 2, max, max, max - 2, max - 4]
    let col = 0
    let row = 0
    let str: string = '\t'.repeat(Math.floor((max - rowSize[row]) / 2))
    for (let i = 0; i < this.nodes.length; i++) {
      str += this.nodes[i].toLog() + '\t'
      col++
      if (col === rowSize[row]) {
        str += '\n\n\n'
        col = 0
        row++
        str += '\t'.repeat(Math.floor((max - rowSize[row]) / 2))
      }
    }
    return str
  }
}

export default Board
