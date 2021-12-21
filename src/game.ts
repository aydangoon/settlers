/**
 * The fundamental game object. Declares and defines a clear public interface for interacting
 * with the game and manages all the logic internally.
 * @module
 */

import {
  NUM_EACH_RESOURCE,
  NUM_KNIGHTS,
  NUM_VPS,
  NUM_MONOPOLY,
  NUM_PLAYERS,
  NUM_ROAD_BUILDING,
  NUM_YEAR_OF_PLENTY,
} from './constants'
import Player from './player'
import ResourceBundle from './resource_bundle'
import Action, { ActionType, RollPayload } from './action'
import isValidTransition, { TurnState } from './turn_fsm'
import { rollDie } from './utils'
import DevCardBundle from './dev_card_bundle'

/**
 * Enum of game phases.
 */
export enum GamePhase {
  SetupForward,
  SetupBackward,
  Playing,
  Finished,
}

export class Game {
  /** A resource bundle for the bank. */
  private bank: ResourceBundle
  /** The dev card deck. */
  private deck: DevCardBundle
  /** The current turn number takes on a value of: [0, NUM_PLAYERS] */
  private turn: number
  /** List of player objects. Indexable by player number. */
  private players: Player[]
  /** The current phase of the game. */
  private phase: GamePhase
  /** The current turn's state, i.e. Postroll, preroll, etc. */
  private turnState: TurnState
  /** The number of roads the current turn's player can place for no cost. */
  private freeRoads: number

  // Some variables needed only for the setup phase.
  private setup_settlementPlaced: boolean

  constructor() {
    this.bank = new ResourceBundle(NUM_EACH_RESOURCE)
    this.deck = new DevCardBundle([
      NUM_KNIGHTS,
      NUM_VPS,
      NUM_YEAR_OF_PLENTY,
      NUM_MONOPOLY,
      NUM_ROAD_BUILDING,
    ])
    this.turn = 0
    this.players = [...Array(NUM_PLAYERS)].map(() => new Player())
    this.freeRoads = 0

    // TODO board initialization, shuffle development cards, ports, etc.

    this.phase = GamePhase.SetupForward
    this.setup_settlementPlaced = false
    this.turnState = TurnState.SetupSettlement
  }

  // ============================ can_ helper methods ==========================

  // can_ prefixed functions are helpers to check if an action is allowed given
  // game's state.

  // ============================ do_ helper methods ============================

  // do_ prefixed functions are helpers to handle their respective actions.

  private do_roll(action: Action) {
    // TODO: all the roll logic.

    // Update turn state.
    this.turnState = TurnState.Postroll
  }

  private do_endTurn(action: Action) {
    this.freeRoads = 0
    this.turn = (this.turn + 1) % NUM_PLAYERS
    this.turnState = TurnState.Preroll
  }

  /**
   * Check if an action is valid.
   * @param action The action requested to be done
   * @param requester The player number who requested the action
   * @returns Boolean indicating if the action is valid.
   */
  private isValid(action: Action, requester: number): boolean {
    // Is this action restricted only to the player of the current turn?
    if (
      requester != this.turn &&
      (this.turnState === TurnState.Preroll ||
        ![
          ActionType.Discard,
          ActionType.MakeTradeOffer,
          ActionType.DecideOnTradeOffer,
        ].includes(action.type))
    ) {
      return false
    }

    // Is the requested action an acceptable transition given
    // the current `turnState`?
    if (!isValidTransition(this.turnState, action)) return false

    // TODO: is the action acceptable given the rest of the game's state?
    switch (action.type) {
      default:
        return true
    }
  }

  // ============================ Public Interface ============================

  /**
   * Check if an action is valid, make action deterministic (edge cases), then do the action.
   * @param action The action to be handled.
   * @param requester Player number who requested the action.
   * @returns `null` if `action` is invalid, the completed, valid action otherwise.
   */
  public handleAction(action: Action, requester: number): null | Action {
    // Determine if the action can be done given current game state.
    if (!this.isValid(action, requester)) return null

    // The two edge cases where we need to update our action's payload due
    // to randomness
    if (action.type === ActionType.Roll) {
      const payload = <RollPayload>action.payload
      payload.value = rollDie() + rollDie()
    } else if (action.type === ActionType.DrawDevelopmentCard) {
      // TODO
    }

    // update internal state based on this action.
    this.doAction(action)

    // return the completed, valid action.
    return action
  }

  /**
   *
   * @param action
   */
  public doAction(action: Action): void {
    if (action.type === ActionType.Roll) {
      this.do_roll(action)
    } else if (action.type === ActionType.EndTurn) {
      this.do_endTurn(action)
    }
  }
}

export default Game
