import Loggable from '../loggable'
import Port from './port'

/**
 * A node on our board.
 */
export class Node implements Loggable {
  /** The player number who has built on this node. -1 if none. */
  private player: number = -1
  /** If the node has a city. */
  private city: boolean = false
  /** The node's port or null if none. Set at initialization. */
  private port: Port | null = null

  /**
   * Convenience method to check if node is empty.
   * Preferrable to `node.getPlayer() === -1` everywhere.
   * @returns True if empty.
   */
  public isEmpty = () => this.player === -1

  /**
   * @returns The port object or null if no port.
   */
  public getPort = () => this.port

  /**
   * @returns The number of the player on this node, -1 if none.
   */
  public getPlayer = () => this.player

  /**
   * @returns Boolean indicating if this node has a city.
   */
  public hasCity = () => this.city

  /**
   * Build a settlement on this node.
   * @param player The settlement's player number.
   */
  public buildSettlement(player: number): void {
    if (this.player !== -1) return
    this.player = player
  }

  /**
   * Upgrade a settlement to a city on this node.
   */
  public buildCity(): void {
    if (this.player === -1) return
    this.city = true
  }

  /**
   * Set the port. Can only be done once.
   * @param port The port to set.
   */
  public setPort(port: Port): void {
    if (this.port !== null) return
    this.port = port
  }

  toLog = () =>
    this.isEmpty()
      ? '(_, empty)'
      : `(${this.player}, ${this.city ? 'city' : 'set'})`
}

export default Node
