import { strict, strictEqual } from 'assert'
import Tile from '../../src/game/board/tile'
import Resource from '../../src/game/resource/resource'

describe('tile lifecycle & isAdjacentTo()', () => {
  it('should have valid state', () => {
    const t: Tile = new Tile(Resource.Ore, [0, 1, 2])
    const t2: Tile = new Tile(Resource.Lumber, [2, 3, 4])
    const t3: Tile = new Tile(Resource.Ore, [5, 7])
    strictEqual(t.resource, Resource.Ore)
    strictEqual(t.isAdjacentTo(t2), true)
    strictEqual(t2.isAdjacentTo(t), true)
    strictEqual(t2.isAdjacentTo(t3), false)
    strictEqual(t3.isAdjacentTo(t2), false)
    strictEqual(t3.isAdjacentTo(t), false)
  })
})
