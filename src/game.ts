/**
 * The fundamental game object. Declares and defines a clear public interface for interacting
 * with the game and manages all the logic internally.
 * @module
 */

import { NUM_EACH_RESOURCE, NUM_PLAYERS } from './constants'
import Player from './player'
import ResourceBundle from './resource_bundle'

export enum GamePhase {
  SetupForward,
  SetupBackward,
}

export class Game {
  private bank: ResourceBundle
  private turn: number
  private players: Player[]
  private phase: GamePhase

  // Some variables needed only for the setup phase.
  private setup_settlementPlaced: boolean

  constructor() {
    this.bank = new ResourceBundle(NUM_EACH_RESOURCE)
    this.turn = 0
    this.players = new Array(NUM_PLAYERS).fill(new Player())

    // TODO board initialization, shuffle development cards, ports, etc.

    this.phase = GamePhase.SetupForward
    this.setup_settlementPlaced = false
  }
}

export default Game
