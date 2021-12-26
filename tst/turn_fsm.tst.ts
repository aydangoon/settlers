import assert from 'assert'
import Action, { ActionType } from '../src/game/action'
import isValidTransition, { TurnState } from '../src/game/turn_fsm'

describe('isValidTransition()', () => {
  it('(preroll, roll) should return true', () => {
    assert.strictEqual(isValidTransition(TurnState.Preroll, new Action(ActionType.Roll)), true)
  })

  it('(movingrobber, roll) should return false', () => {
    assert.strictEqual(
      isValidTransition(TurnState.MovingRobber, new Action(ActionType.Roll)),
      false
    )
  })
})
