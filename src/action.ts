/**
 * Declares and defines all possible actions.
 * @module
 */

import Resource from './resource'

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

  DrawDevelopmentCard,

  EndTurn,
}

export interface ActionPayload {}

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
  constructor(type: ActionType, payload: ActionPayload = {}) {
    this.type = type
    this.payload = payload
  }

  public toJSON() {
    return JSON.stringify(this)
  }
}

export default Action
