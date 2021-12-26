import assert, { strictEqual, notStrictEqual } from 'assert'
import Action, { ActionType, RollPayload } from '../src/action'
import Game, { GamePhase } from '../src/game'
import { TurnState } from '../src/turn_fsm'

describe('handle roll action', () => {
  const game: any = new Game()

  // configure game
  game.turnState = TurnState.Preroll

  it('handleAction(<roll action>, 1) returns null, requester incorrect', () => {
    const e = (<Game>game).handleAction(new Action(ActionType.Roll, 1, { value: 3 }))
    assert.strictEqual(e, null)
    assert.strictEqual(game.turnState, TurnState.Preroll)
  })

  it('handleAction(<roll action>, 0) returns a roll event', () => {
    const e = (<Game>game).handleAction(new Action(ActionType.Roll, 0, { value: 3 }))
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

  // configure game
  game.turnState = TurnState.Preroll

  it('roll, endturn, roll, endturn', () => {
    game.handleAction(new Action(ActionType.Roll, 0, { value: 3 }))
    assert.strictEqual(game.turnState, TurnState.Postroll)
    game.handleAction(new Action(ActionType.EndTurn, 0))
    assert.strictEqual(game.turnState, TurnState.Preroll)
    assert.strictEqual(game.turn, 1)

    game.handleAction(new Action(ActionType.Roll, 1, { value: 3 }))
    assert.strictEqual(game.turnState, TurnState.Postroll)
    game.handleAction(new Action(ActionType.EndTurn, 1))
    assert.strictEqual(game.turnState, TurnState.Preroll)
    assert.strictEqual(game.turn, 2)
  })
})

describe('setup phases', () => {
  it('works', () => {
    const g: Game = new Game()
    const a: any = g as any
    let act: Action | null

    // Forward setup.
    for (let i = 0; i < 4; i++) {
      strictEqual(a.phase, GamePhase.SetupForward)
      strictEqual(a.turn, i)
      strictEqual(a.turnState, TurnState.SetupSettlement)

      act = g.handleAction(new Action(ActionType.BuildSettlement, i, { node: 2 * i }))

      notStrictEqual(act, null)
      strictEqual(a.phase, GamePhase.SetupForward)
      strictEqual(a.turn, i)
      strictEqual(a.turnState, TurnState.SetupRoad)

      act = g.handleAction(new Action(ActionType.BuildRoad, i, { node0: 2 * i, node1: 2 * i + 8 }))

      notStrictEqual(act, null)
    }

    for (let i = 3; i >= 0; i--) {
      strictEqual(a.phase, GamePhase.SetupBackward)
      strictEqual(a.turn, i)
      strictEqual(a.turnState, TurnState.SetupSettlement)

      act = g.handleAction(new Action(ActionType.BuildSettlement, i, { node: 7 + 2 * i }))

      notStrictEqual(act, null)
      strictEqual(a.phase, GamePhase.SetupBackward)
      strictEqual(a.turn, i)
      strictEqual(a.turnState, TurnState.SetupRoad)

      act = g.handleAction(
        new Action(ActionType.BuildRoad, i, { node0: 7 + 2 * i, node1: 17 + 2 * i })
      )

      notStrictEqual(act, null)
    }
    strictEqual(a.phase, GamePhase.Playing)
  })
})
