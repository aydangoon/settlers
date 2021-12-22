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
  NUM_RESOURCE_TYPES,
  ROBBER_LIMIT,
} from './constants'
import Player from './player'
import ResourceBundle from './resource_bundle'
import Action, {
  ActionType,
  BuildCityPayload,
  BuildRoadPayload,
  BuildSettlementPayload,
  MoveRobberPayload,
  RobPayload,
  RollPayload,
} from './action'
import isValidTransition, { TurnState } from './turn_fsm'
import { rollDie } from './utils'
import DevCardBundle from './dev_card_bundle'
import Board from './board/board'
import Node from './board/node'
import Resource from './resource'
import DevCard from './dev_card'

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
  /** The board. */
  private board: Board
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
  /** Boolean list of players who still need to submit discard actions. */
  private mustDiscard: boolean[]
  /** Boolean indicating if we have rolled on the current turn yet. */
  private hasRolled: boolean

  constructor() {
    this.bank = new ResourceBundle(NUM_EACH_RESOURCE)
    this.deck = new DevCardBundle([
      NUM_KNIGHTS,
      NUM_VPS,
      NUM_YEAR_OF_PLENTY,
      NUM_MONOPOLY,
      NUM_ROAD_BUILDING,
    ])
    this.board = new Board()
    this.turn = 0
    this.players = [...Array(NUM_PLAYERS)].map(() => new Player())
    this.freeRoads = 0
    this.hasRolled = false

    this.phase = GamePhase.SetupForward

    this.turnState = TurnState.SetupSettlement
    this.mustDiscard = [...Array(NUM_PLAYERS)].map(() => false)
  }

  // ============================ can_ helper methods ==========================

  // can_ prefixed functions are helpers to check if an action is allowed given
  // game's state. These **dont** change game state.

  // ============================ do_ helper methods ============================

  // do_ prefixed functions are helpers to actually do their respective actions.
  // these **change** game state.

  private do_roll(payload: RollPayload) {
    if (payload.value !== 7) {
      // Standard case. Hand out resources.

      // Production for each player.
      const production: ResourceBundle[] = [...Array(NUM_PLAYERS)].map(() => new ResourceBundle())

      // For every tile, update the production of each player.
      this.board.tiles
        .filter((tile, i) => this.board.robber !== i && tile.getNumber() === payload.value)
        .forEach((tile) => {
          tile.nodes.forEach((nodeid) => {
            const node = this.board.nodes[nodeid]
            if (!node.isEmpty()) {
              production[node.getPlayer()].add(tile.resource, node.hasCity() ? 2 : 1)
            }
          })
        })

      // Check if the bank has enough of each resource.
      for (let i = 0; i < NUM_RESOURCE_TYPES; i++) {
        const sum = production.reduce((acc, bundle) => acc + bundle.get(i as Resource), 0)
        // If there is not enough of a resource, noone gets it.
        if (sum > this.bank.get(i as Resource)) {
          production.forEach((bundle) => bundle.removeAll(i as Resource))
        }
      }

      // Finally distribute the production bundles to their respective players.
      production.forEach((bundle, i) => this.players[i].resources.add(bundle))

      this.turnState = TurnState.Postroll
    } else {
      // Robber case.
      this.mustDiscard = this.players.map(({ resources }) => resources.size() > ROBBER_LIMIT)

      const overLimit = this.mustDiscard.reduce((acc, curr) => acc || curr, false)

      // If someone is over the limit, we move to discarding state before moving robber.
      // Otherwise we just move to moving robber state.
      this.turnState = overLimit ? TurnState.Discarding : TurnState.MovingRobber
    }
    this.hasRolled = true
  }

  private do_buildSettlement(payload: BuildSettlementPayload) {
    if (this.phase === GamePhase.Playing) {
      this.board.nodes[payload.node].buildSettlement(this.turn)
      this.players[this.turn].resources.subtract(ResourceBundle.settlementCost)
    } else {
      // Setup case. just build the settlement where requested.
      this.board.nodes[payload.node].buildSettlement(this.turn)
      // If this is our second setup phase settlement, collect resources.
      if (this.phase === GamePhase.SetupBackward) {
        this.board.tiles
          .filter(({ nodes }) => nodes.includes(payload.node))
          .forEach(({ resource }) => this.players[this.turn].resources.add(resource, 1))
      }
      this.turnState = TurnState.SetupRoad
    }
  }

  private do_buildRoad(payload: BuildRoadPayload) {
    const { node0, node1 } = payload
    if (this.phase === GamePhase.Playing) {
      this.board.roadnetwork.buildRoad(node0, node1, this.turn)
      this.players[this.turn].resources.subtract(ResourceBundle.roadCost)
    } else {
      // Setup case. just build the road where requested.
      this.board.roadnetwork.buildRoad(node0, node1, this.turn)
      if (this.phase === GamePhase.SetupForward) {
        if (this.turn === NUM_PLAYERS - 1) {
          this.phase = GamePhase.SetupBackward
        } else {
          this.turn++
        }
        this.turnState = TurnState.SetupSettlement
      } else {
        if (this.turn === 0) {
          this.phase = GamePhase.Playing
          this.turnState = TurnState.Preroll
        } else {
          this.turn--
          this.turnState = TurnState.SetupSettlement
        }
      }
    }
  }

  private do_buildCity(payload: BuildCityPayload) {
    this.board.nodes[payload.node].buildCity()
    this.players[this.turn].resources.subtract(ResourceBundle.cityCost)
  }

  private do_playRobber() {
    this.players[this.turn].devCards.remove(DevCard.Knight)
    this.turnState = TurnState.MovingRobber
  }

  private do_moveRobber(payload: MoveRobberPayload) {
    this.board.robber = payload.to
    this.turnState = TurnState.Robbing
  }

  private do_Rob(payload: RobPayload) {
    const res: Resource = this.players[payload.victim].resources.removeOneAtRandom()
    this.players[this.turn].resources.add(res, 1)
    this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll
  }

  private do_endTurn() {
    this.freeRoads = 0
    this.turn = (this.turn + 1) % NUM_PLAYERS
    this.hasRolled = false
    this.turnState = TurnState.Preroll
  }

  /**
   * Check if an action is valid.
   * @param action The action requested to be done
   * @param requester The player number who requested the action
   * @returns Boolean indicating if the action is valid.
   */
  private isValidAction(action: Action, requester: number): boolean {
    // Is this action restricted only to the player of the current turn?
    if (
      requester != this.turn &&
      (this.turnState === TurnState.Preroll ||
        ![ActionType.Discard, ActionType.MakeTradeOffer, ActionType.DecideOnTradeOffer].includes(
          action.type
        ))
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

  private doAction(action: Action): void {
    const { payload, type } = action
    if (type === ActionType.Roll) {
      this.do_roll(payload as RollPayload)
    } else if (type === ActionType.EndTurn) {
      this.do_endTurn()
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
    if (!this.isValidAction(action, requester)) return null

    // The two edge cases where we need to update our action's payload due
    // to randomness
    if (action.type === ActionType.Roll) {
      const payload = <RollPayload>action.payload
      if (payload.value === undefined) {
        payload.value = rollDie() + rollDie()
      }
    } else if (action.type === ActionType.DrawDevelopmentCard) {
      // TODO
    }

    // Safely update internal state based on the validated action.
    this.doAction(action)

    // return the completed, valid action.
    return action
  }
}

export default Game
