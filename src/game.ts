/**
 * The fundamental game object. Declares and defines a clear public interface for interacting
 * with the game and manages all the logic internally.
 * @module
 */

import { NUM_EACH_RESOURCE, NUM_PLAYERS } from './constants'
import Player from './player'
import ResourceBundle from './resource_bundle'
import Action, { ActionType } from './action'
import Event, { RollEvent } from './event'
import isValidTransition, { TurnState } from './turn_fsm'
import { rollDie } from './utils'

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
  /** The current turn number takes on a value of: [0, NUM_PLAYERS] */
  private turn: number
  /** List of player objects. Indexable by player number. */
  private players: Player[]
  /** The current phase of the game. */
  private phase: GamePhase
  /** The current turn's state, i.e. Postroll, preroll, etc. */
  private turnState: TurnState

  // Some variables needed only for the setup phase.
  private setup_settlementPlaced: boolean

  constructor() {
    this.bank = new ResourceBundle(NUM_EACH_RESOURCE)
    this.turn = 0
    this.players = new Array(NUM_PLAYERS).fill(new Player())

    // TODO board initialization, shuffle development cards, ports, etc.

    this.phase = GamePhase.SetupForward
    this.setup_settlementPlaced = false
    this.turnState = TurnState.SetupSettlement
  }

  // ============================ can_ helper methods ==========================

  // can_ prefixed functions are helpers to check if an action is allowed given
  // game's state.

  // ============================ do_ helper methods ============================

  // do_ prefixed functions are helpers to handle their respective events.

  private do_roll(event: RollEvent) {
    // TODO hand out resources based on event.value

    // Update turn state.
    this.turnState = TurnState.Postroll
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

  /**
   * Get a deterministic, atomic event from an action.
   * @param action
   * @returns An event generated from the action `action`
   */
  private generateEventFrom(action: Action): Event {
    switch (action.type) {
      case ActionType.Roll:
        const value = rollDie() + rollDie()
        return new RollEvent(value, action)
      default:
        return new Event(action)
    }
  }

  // ============================ Public Interface ============================

  /**
   * Check if an action is valid, generate an event from it, and do that event.
   * @param action The action to be handled.
   * @param requester Player number who requested the action.
   * @returns `null` if `action` is invalid, the generated event otherwise.
   */
  public handleAction(action: Action, requester: number): null | Event {
    // Determine if the action can be done given current game state.
    if (!this.isValid(action, requester)) return null

    // Generate an event from the valid action.
    const event = this.generateEventFrom(action)

    // update internal state based on this event.
    this.doEvent(event)

    // return the event.
    return event
  }

  /**
   * Do an event. This function is **agnostic** of game state and will simply
   * attempt to apply the specified event to the game.
   * @param event The event to be done.
   */
  public doEvent(event: Event): void {
    if (event.action.type === ActionType.Roll) {
      this.do_roll(<RollEvent>event)
    }
  }
}

export default Game
