import assert, { strict, strictEqual } from 'assert'
import Node from '../../src/board/node'
import Port from '../../src/board/port'
import Resource from '../../src/resource'

describe('node lifecycle', () => {
  it('should have valid state', () => {
    const n: Node = new Node()
    strictEqual(n.isEmpty(), true)
    strictEqual(n.getPlayer(), -1)
    strictEqual(n.hasCity(), false)
    strictEqual(n.getPort(), null)
    n.buildCity()
    strictEqual(n.isEmpty(), true)
    strictEqual(n.getPlayer(), -1)
    strictEqual(n.hasCity(), false)
    strictEqual(n.getPort(), null)
    n.buildSettlement(0)
    strictEqual(n.isEmpty(), false)
    strictEqual(n.getPlayer(), 0)
    strictEqual(n.hasCity(), false)
    strictEqual(n.getPort(), null)
    n.buildCity()
    strictEqual(n.isEmpty(), false)
    strictEqual(n.getPlayer(), 0)
    strictEqual(n.hasCity(), true)
    strictEqual(n.getPort(), null)
    n.setPort(new Port([Resource.Ore], 2))
    strictEqual(n.getPort()!.rate, 2)
    strictEqual(n.getPort()!.resources, Resource.Ore)
  })
})
