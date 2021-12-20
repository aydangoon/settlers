import assert from 'assert'
import Action, { ActionType } from '../src/action'
import { RollEvent } from '../src/event'
import Game from '../src/game'
import { TurnState } from '../src/turn_fsm'

describe('handle roll event', () => {
  const game: any = new Game()
  let turn: number = 0

  // configure game
  game.turnState = TurnState.Preroll

  it('handleAction(<roll action>, 1) returns null, requester incorrect', () => {
    const e = (<Game>game).handleAction(new Action(ActionType.Roll), turn + 1)
    assert.strictEqual(e, null)
    assert.strictEqual(game.turnState, TurnState.Preroll)
  })

  it('handleAction(<roll action>, 0) returns a roll event', () => {
    const e = (<Game>game).handleAction(new Action(ActionType.Roll), turn)
    assert.notStrictEqual(e, null)
    assert.strictEqual(e instanceof RollEvent, true)
    assert.strictEqual(e!.action.type, ActionType.Roll)
    assert.strictEqual(game.turnState, TurnState.Postroll)
  })
})
