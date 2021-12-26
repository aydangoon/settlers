/**
 * The Finite State Machine for transitioning between turn states based on actions.
 * @module
 */

import { Action, ActionType } from './action'

export enum TurnState {
  SetupSettlement = 'Setup Settlement',
  SetupRoad = 'Setup Road',

  Preroll = 'Pre-roll',
  Postroll = 'Post-roll',

  MovingRobber = 'Moving Robber',
  Robbing = 'Robbing',

  SelectingMonopolyResource = 'Selecting Monopoly Resource',

  SelectingYearOfPlentyResources = 'Selecting Year of Plenty Resource',

  Discarding = 'Discarding',
}

/**
 * Determines if an action may even be considered given the current state.
 * i.e. you can't do a roll action if turn state is `TurnState.Postroll`
 * @param state The current turn state
 * @param action The desired action
 * @returns boolean indicating whether given this turn state, this action is even allowed.
 */
export const isValidTransition = (state: TurnState, action: Action) => {
  const validActions: ActionType[] = (() => {
    switch (state) {
      case TurnState.SetupSettlement:
        return [ActionType.BuildSettlement]
      case TurnState.SetupRoad:
        return [ActionType.BuildRoad]
      case TurnState.Preroll:
        return [
          ActionType.PlayMonopoly,
          ActionType.PlayRobber,
          ActionType.PlayYearOfPlenty,
          ActionType.Roll,
        ]
      case TurnState.MovingRobber:
        return [ActionType.MoveRobber]
      case TurnState.Robbing:
        return [ActionType.Rob]
      case TurnState.SelectingMonopolyResource:
        return [ActionType.SelectMonopolyResource]
      case TurnState.SelectingYearOfPlentyResources:
        return [ActionType.SelectYearOfPlentyResources]
      case TurnState.Discarding:
        return [ActionType.Discard]
      default:
        return [ActionType.EndTurn]
    }
  })()
  return validActions.includes(action.type)
}

export default isValidTransition
