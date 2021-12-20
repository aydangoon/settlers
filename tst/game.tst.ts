import assert from 'assert'
import Action, { ActionType, RollPayload } from '../src/action'
import Game from '../src/game'
import { TurnState } from '../src/turn_fsm'

describe('handle roll action', () => {
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
    assert.strictEqual(e instanceof Action, true)
    assert.strictEqual(e!.type, ActionType.Roll)
    const payload = e!.payload as RollPayload
    assert.strictEqual(payload.value <= 12, true)
    assert.strictEqual(payload.value >= 1, true)
    assert.strictEqual(game.turnState, TurnState.Postroll)
  })
})

describe('roll & endturn actions', () => {
  const game: any = new Game()
  let turn: number = 0

  // configure game
  game.turnState = TurnState.Preroll

  it('roll, endturn, roll, endturn', () => {
    game.handleAction(new Action(ActionType.Roll), turn)
    assert.strictEqual(game.turnState, TurnState.Postroll)
    game.handleAction(new Action(ActionType.EndTurn), turn)
    assert.strictEqual(game.turnState, TurnState.Preroll)
    assert.strictEqual(game.turn, 1)

    turn++

    game.handleAction(new Action(ActionType.Roll), turn)
    assert.strictEqual(game.turnState, TurnState.Postroll)
    game.handleAction(new Action(ActionType.EndTurn), turn)
    assert.strictEqual(game.turnState, TurnState.Preroll)
    assert.strictEqual(game.turn, 2)
  })
})
