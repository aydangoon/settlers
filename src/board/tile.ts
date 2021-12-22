import Loggable from '../loggable'
import Resource, { resStr } from '../resource'

/**
 * A tile on the board.
 */
export class Tile implements Loggable {
  /** The resource of the tile. Set once at initialization. */
  readonly resource: Resource
  /** The nodeids of the nodes incident on this tile. Set once at initialization. */
  readonly nodes: number[]
  /** The number of the tile. Used in calculating resource production. */
  private number: number = -1

  constructor(resource: Resource, nodes: number[]) {
    this.resource = resource
    this.nodes = nodes
  }

  /**
   * Set the number for the tile. This can only be done once.
   * @param number The value we want to set.
   */
  public setNumber(number: number) {
    if (this.number !== -1) return
    this.number = number
  }

  public getNumber = () => this.number

  /**
   * Check if a tile is adjacent to this tile.
   * @param other The other tile.
   * @returns true if this tile is adjacent to `other`
   */
  public isAdjacentTo(other: Tile) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (other.nodes.includes(this.nodes[i])) return true
    }
    return false
  }

  toLog = () => `(${this.number}, ${resStr(this.resource)})`
}

export default Tile
