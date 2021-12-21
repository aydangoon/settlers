import assert, { strict, strictEqual } from 'assert'
import Edge from '../../src/board/edge'

describe('edge lifecycle', () => {
  it('should have valid state', () => {
    const e: Edge = new Edge()
    strictEqual(e.isEmpty(), true)
    strictEqual(e.getPlayer(), -1)
    e.buildRoad(0)
    strictEqual(e.isEmpty(), false)
    strictEqual(e.getPlayer(), 0)
    e.buildRoad(1)
    strictEqual(e.isEmpty(), false)
    strictEqual(e.getPlayer(), 0)
  })
})
