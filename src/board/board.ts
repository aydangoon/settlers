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
import { uniformRandom, weightedRandom } from '../utils'
import Port from './port'
import Resource from '../resource'
import RoadNetwork from './road_network'
import Loggable from '../loggable'

/**
 * A game board. The board manages the internal logic
 * for the underlying undirected graph and its own state.
 * It is **agnostic** of game state and will never check if
 * a call to its public interface violates game state.
 */
export class Board implements Loggable {
  readonly nodes: Node[]
  readonly roadnetwork: RoadNetwork
  readonly tiles: Tile[]
  public robber: number = -1

  constructor() {
    this.roadnetwork = new RoadNetwork()
    this.nodes = this.generateNodes()
    // Generate tiles & set robber.
    this.tiles = this.generateTiles()
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
      const index =
        tiles[i].resource !== Resource.None ? weightedRandom(tokens) : 5

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
