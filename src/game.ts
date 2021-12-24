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
  DiscardPayload,
  DrawDevCardPayload,
  MakeTradeOfferPayload,
  MoveRobberPayload,
  RobPayload,
  RollPayload,
  SelectMonopolyResourcePayload,
  SelectYearOfPlentyResourcesPayload,
  TradeOfferDecisionPayload,
} from './action'
import isValidTransition, { TurnState } from './turn_fsm'
import { rollDie } from './utils'
import DevCardBundle from './dev_card_bundle'
import Board from './board/board'
import Resource from './resource'
import DevCard from './dev_card'
import TradeOffer, { TradeStatus } from './trade_offer'

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
  /** A list of open trade offers in the current turn. */
  private tradeOffers: TradeOffer[]
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
    this.tradeOffers = []
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

  private do_roll(action: Action) {
    const { value } = action.payload as RollPayload
    if (value !== 7) {
      // Standard case. Hand out resources.

      // Production for each player.
      const production: ResourceBundle[] = [...Array(NUM_PLAYERS)].map(() => new ResourceBundle())

      // For every tile, update the production of each player.
      const prodTiles = this.board.tiles.filter(
        (tile, i) => this.board.robber !== i && tile.getNumber() === value
      )

      for (let i = 0; i < prodTiles.length; i++) {
        const tile = prodTiles[i]
        for (let j = 0; j < tile.nodes.length; j++) {
          const node = this.board.nodes[tile.nodes[j]]
          if (!node.isEmpty()) {
            production[node.getPlayer()].add(tile.resource, node.hasCity() ? 2 : 1)
          }
        }
      }

      // Check if the bank has enough of each resource.
      for (let i = 0; i < NUM_RESOURCE_TYPES; i++) {
        let sum = 0
        for (let j = 0; j < production.length; j++) {
          sum += production[j].get(i as Resource)
        }
        // If there is not enough of a resource, noone gets it.
        if (sum > this.bank.get(i as Resource)) {
          production.forEach((bundle) => bundle.removeAll(i as Resource))
        }
      }

      // Finally distribute the production bundles to their respective players.
      for (let i = 0; i < production.length; i++) {
        this.players[i].resources.add(production[i])
      }

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

  // Build things.

  private do_buildSettlement(action: Action) {
    const { node } = action.payload as BuildSettlementPayload
    if (this.phase === GamePhase.Playing) {
      this.board.nodes[node].buildSettlement(this.turn)
      this.players[this.turn].resources.subtract(ResourceBundle.settlementCost)
    } else {
      // Setup case. just build the settlement where requested.
      this.board.nodes[node].buildSettlement(this.turn)
      // If this is our second setup phase settlement, collect resources.
      if (this.phase === GamePhase.SetupBackward) {
        this.board.tiles
          .filter(({ nodes }) => nodes.includes(node))
          .forEach(({ resource }) => this.players[this.turn].resources.add(resource, 1))
      }
      this.turnState = TurnState.SetupRoad
    }
  }

  private do_buildRoad(action: Action) {
    const { node0, node1 } = action.payload as BuildRoadPayload
    if (this.phase === GamePhase.Playing) {
      this.board.roadnetwork.buildRoad(node0, node1, this.turn)
      if (this.freeRoads === 0) {
        this.players[this.turn].resources.subtract(ResourceBundle.roadCost)
      } else {
        this.freeRoads--
      }
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

  private do_buildCity(action: Action) {
    const { node } = action.payload as BuildCityPayload
    this.board.nodes[node].buildCity()
    this.players[this.turn].resources.subtract(ResourceBundle.cityCost)
  }

  // Play dev cards.

  private do_playRobber() {
    this.players[this.turn].devCards.remove(DevCard.Knight)
    this.turnState = TurnState.MovingRobber
  }

  private do_moveRobber(action: Action) {
    const { to } = action.payload as MoveRobberPayload
    this.board.robber = to
    if (this.board.playersOnRobber().find((p) => p !== this.turn) !== undefined) {
      this.turnState = TurnState.Robbing
    } else {
      this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll
    }
  }

  private do_Rob(action: Action) {
    const { victim } = action.payload as RobPayload
    const res: Resource = this.players[victim].resources.removeOneAtRandom()
    this.players[this.turn].resources.add(res, 1)
    this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll
  }

  private do_playMonopoly() {
    this.players[this.turn].devCards.remove(DevCard.Monopoly)
    this.turnState = TurnState.SelectingMonopolyResource
  }

  private do_selectMonopolyResource(action: Action) {
    const { resource } = action.payload as SelectMonopolyResourcePayload
    for (let i = 0; i < NUM_PLAYERS; i++) {
      if (i === this.turn) continue
      const amnt = this.players[i].resources.removeAll(resource)
      this.players[this.turn].resources.add(resource, amnt)
    }
    this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll
  }

  private do_playYearOfPlenty() {
    this.players[this.turn].devCards.remove(DevCard.YearOfPlenty)
    this.turnState = TurnState.SelectingYearOfPlentyResources
  }

  private do_selectYearOfPlentyResources(action: Action) {
    const { resources } = action.payload as SelectYearOfPlentyResourcesPayload
    for (let i = 0; i < 2; i++) {
      this.players[this.turn].resources.add(i as Resource, 1)
      this.bank.subtract(i as Resource, 1)
    }
    this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll
  }

  private do_playRoadBuilder() {
    this.players[this.turn].devCards.remove(DevCard.RoadBuilder)
    this.freeRoads = 2
    this.turnState = this.hasRolled ? TurnState.Preroll : TurnState.Postroll
  }

  private do_discard(action: Action) {
    const { bundle } = action.payload as DiscardPayload
    this.players[action.player].resources.subtract(bundle)
    this.mustDiscard[action.player] = false

    const overLimit = this.mustDiscard.reduce((acc, curr) => acc || curr, false)

    // If someone is over the limit, we move to discarding state before moving robber.
    // Otherwise we just move to moving robber state.
    this.turnState = overLimit ? TurnState.Discarding : TurnState.MovingRobber
  }

  private do_drawDevCard(action: Action) {
    const { card } = action.payload as DrawDevCardPayload
    this.players[this.turn].devCards.add(card)
    this.deck.remove(card)
  }

  // Trades

  private do_makeTradeOffer(action: Action) {
    const { offer, request } = action.payload as MakeTradeOfferPayload
    const id =
      this.tradeOffers.length > 0 ? this.tradeOffers[this.tradeOffers.length - 1].id + 1 : 0
    const tradeOffer = new TradeOffer(id, action.player, offer, request)
  }

  private do_decideOnTradeOffer(action: Action) {
    const { status, player, id } = action.payload as TradeOfferDecisionPayload
    const index = this.tradeOffers.findIndex((to) => to.id === id)
    const tradeOffer: TradeOffer = this.tradeOffers[index]

    if (tradeOffer.offerer === action.player) {
      if (status === TradeStatus.Decline) {
        // Case 0: Closing a trade offer we own.
        this.tradeOffers.splice(index, 1)
      } else if (player !== undefined) {
        // Case 1: Trading with a player who accepted our offer.
        ResourceBundle.trade(
          tradeOffer.request,
          this.players[player].resources,
          tradeOffer.offer,
          this.players[action.player].resources
        )
        this.tradeOffers.splice(index, 1)
      }
    } else {
      // Case 2: Change our status on some other trade offer.
      tradeOffer.status[action.player] = status

      // If our declination means everyone declined, delete the offer.
      if (status === TradeStatus.Decline && tradeOffer.allDeclined()) {
        this.tradeOffers.splice(index, 1)
      }
    }
  }

  private do_endTurn() {
    this.freeRoads = 0
    this.turn = (this.turn + 1) % NUM_PLAYERS
    this.hasRolled = false
    this.turnState = TurnState.Preroll
    this.tradeOffers = []
  }

  private doAction(action: Action): void {
    const { type } = action
    if (type === ActionType.Roll) {
      this.do_roll(action)
    } else if (type === ActionType.PlayRobber) {
      this.do_playRobber()
    } else if (type === ActionType.MoveRobber) {
      this.do_moveRobber(action)
    } else if (type === ActionType.Rob) {
      this.do_Rob(action)
    } else if (type === ActionType.PlayMonopoly) {
      this.do_playMonopoly()
    } else if (type === ActionType.SelectMonopolyResource) {
      this.do_selectMonopolyResource(action)
    } else if (type === ActionType.PlayYearOfPlenty) {
      this.do_playYearOfPlenty()
    } else if (type === ActionType.SelectYearOfPlentyResources) {
      this.do_selectYearOfPlentyResources(action)
    } else if (type === ActionType.PlayRoadBuilder) {
      this.do_playRoadBuilder()
    } else if (type === ActionType.BuildSettlement) {
      this.do_buildSettlement(action)
    } else if (type === ActionType.BuildCity) {
      this.do_buildCity(action)
    } else if (type === ActionType.BuildRoad) {
      this.do_buildRoad(action)
    } else if (type === ActionType.Discard) {
      this.do_discard(action)
    } else if (type === ActionType.MakeTradeOffer) {
      this.do_makeTradeOffer(action)
    } else if (type === ActionType.DecideOnTradeOffer) {
      this.do_decideOnTradeOffer(action)
    } else if (type === ActionType.DrawDevCard) {
      this.do_drawDevCard(action)
    } else {
      this.do_endTurn()
    }
  }

  // ============================ Public Interface ============================

  /**
   * Check if an action is valid.
   * @param action The action requested to be done
   * @returns Boolean indicating if the action is valid.
   */
  public isValidAction(action: Action): boolean {
    // Is this action restricted only to the player of the current turn?
    if (
      action.player != this.turn &&
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

  /**
   * Check if an action is valid, make action deterministic (edge cases), then do the action.
   * @param action The action to be handled.
   * @param requester Player number who requested the action.
   * @returns `null` if `action` is invalid, the completed, valid action otherwise.
   */
  public handleAction(action: Action): null | Action {
    // Determine if the action can be done given current game state.
    if (!this.isValidAction(action)) return null

    // The two edge cases where we need to update our action's payload due
    // to randomness
    if (action.type === ActionType.Roll) {
      const payload = <RollPayload>action.payload
      if (payload.value === undefined) {
        payload.value = rollDie() + rollDie()
      }
    } else if (action.type === ActionType.DrawDevCard) {
      const payload = <DrawDevCardPayload>action.payload
      if (payload.card === undefined) {
        payload.card = this.deck.pickOneAtRandom()
      }
    }

    // Safely update internal state based on the validated action.
    this.doAction(action)

    // return the completed, valid action.
    return action
  }
}

export default Game
