import assert, { strict, strictEqual } from 'assert'
import { ActionType, Action } from '../src/game/action'

describe('roll action', () => {
  it('should create a roll action', () => {
    assert.strictEqual(new Action(ActionType.Roll).type, ActionType.Roll)
  })
})
