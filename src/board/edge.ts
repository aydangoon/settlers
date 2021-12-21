export class Edge {
  private player: number = -1

  /**
   * Convenience method to check if node is empty.
   * Preferrable to `node.getPlayer() === -1` everywhere.
   * @returns True if empty.
   */
  public isEmpty = () => this.player === -1

  public getPlayer = () => this.player

  public buildRoad(player: number) {
    if (this.player !== -1) return
    this.player = player
  }
}

export default Edge
