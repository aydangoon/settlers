/**
 * Declares and defines all possible actions.
 * @module
 */

import DevCard from './dev_card/dev_card'
import Resource from './resource/resource'
import ResourceBundle from './resource/resource_bundle'
import { TradeStatus } from './trade_offer'

/**
 * All possible types of actions.
 */
export enum ActionType {
  Roll,

  PlayRobber,
  MoveRobber,
  Rob,

  PlayMonopoly,
  SelectMonopolyResource,

  PlayYearOfPlenty,
  SelectYearOfPlentyResources,

  PlayRoadBuilder,

  BuildSettlement,
  BuildCity,
  BuildRoad,

  Discard,

  MakeTradeOffer,
  DecideOnTradeOffer,

  DrawDevCard,
  Exchange,

  EndTurn,
}

export const actionTypeStr = (a: ActionType) => {
  switch (a) {
    case ActionType.Roll:
      return 'Roll'
    case ActionType.PlayRobber:
      return 'Play Robber'
    case ActionType.MoveRobber:
      return 'Move Robber'
    case ActionType.Rob:
      return 'Rob'
    case ActionType.PlayMonopoly:
      return 'Play Monopoly'
    case ActionType.SelectMonopolyResource:
      return 'Select Monopoly Resource'
    case ActionType.PlayYearOfPlenty:
      return 'Play YOP'
    case ActionType.SelectYearOfPlentyResources:
      return 'Select YOP Resources'
    case ActionType.PlayRoadBuilder:
      return 'Play Road Builder'
    case ActionType.BuildSettlement:
      return 'Build Settlement'
    case ActionType.BuildCity:
      return 'Build City'
    case ActionType.BuildRoad:
      return 'Build Road'
    case ActionType.Discard:
      return 'Discard'
    case ActionType.MakeTradeOffer:
      return 'Make Trade Offer'
    case ActionType.DecideOnTradeOffer:
      return 'Decide on Trade Offer'
    case ActionType.DrawDevCard:
      return 'Draw Dev Card'
    case ActionType.Exchange:
      return 'Exchange'
    default:
      return 'End Turn'
  }
}

export interface ActionPayload {}

export interface ExchangePayload extends ActionPayload {
  offer: Resource
  request: Resource
}

export interface MakeTradeOfferPayload extends ActionPayload {
  /** What is the actual offer lol */
  offer: ResourceBundle
  request: ResourceBundle
}

export interface TradeOfferDecisionPayload extends ActionPayload {
  /** The decision. */
  status: TradeStatus
  /** The id of the trade. */
  id: number
  /** The player we are agreeing to do the trade with. Only needed by host. */
  withPlayer?: number
}

export interface DiscardPayload extends ActionPayload {
  /** The bundle we'll be discarding */
  bundle: ResourceBundle
}

export interface DrawDevCardPayload extends ActionPayload {
  /** The card we draw */
  card: DevCard
}

export interface RollPayload extends ActionPayload {
  /** the value of the dice sum. */
  value: number
}

export interface MoveRobberPayload extends ActionPayload {
  /** The tile number we want to move the robber to. */
  to: number
}

export interface RobPayload extends ActionPayload {
  /** The number of the player we want to rob. */
  victim: number
}

export interface SelectMonopolyResourcePayload extends ActionPayload {
  /** The resource we want to monopoly. */
  resource: Resource
}

export interface SelectYearOfPlentyResourcesPayload extends ActionPayload {
  /** The resources we want to get. */
  resources: [Resource, Resource]
}

export interface BuildSettlementPayload extends ActionPayload {
  /** The node number we want to build a settlement on. */
  node: number
}

export interface BuildCityPayload extends ActionPayload {
  /** The node number we want to build a city on. */
  node: number
}

export interface BuildRoadPayload extends ActionPayload {
  /** The edge number we want to build a settlement on. */
  node0: number
  node1: number
}

/**
 * An action is a request to change the game's state in some way
 * such as by rolling the die, accepting a trade offer, playing a development card, etc.
 *
 * All actions are **verifiable**, meaning they can (and always are) checked to
 * be valid actions given the current game state. i.e. you can't roll twice on a turn.
 *
 * Actions link between turn states in the turn state finite state machine.
 *
 * A verified action can be applied to game state to update it in a safe and predictable
 * manner.
 */
export class Action {
  /** The type of the action. */
  readonly type: ActionType
  /** Any additional data needed to convey the desired action. */
  readonly payload: ActionPayload
  /** The player number who is requesting the action. */
  readonly player: number
  constructor(type: ActionType, player: number = 0, payload: ActionPayload = {}) {
    this.type = type
    this.player = player
    this.payload = payload
  }

  public serialized = (): string => JSON.stringify(this)

  public static deserialize = (serializedObj: string): Action => {
    const { type, payload, player } = JSON.parse(serializedObj)
    return new Action(type, player, payload)
  }
}

export default Action
