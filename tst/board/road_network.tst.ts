import { notStrictEqual, strictEqual } from 'assert'
import RoadNetwork from '../../src/board/road_network'

describe('road network', () => {
  it('addConnection(), getConnection(), buildRoad(), getRoad(), adjacentTo()', () => {
    let r: any = new RoadNetwork()
    strictEqual(r.hasConnection(0, 1), false)
    strictEqual(r.hasConnection(1, 0), false)
    r.addConnection(0, 1)
    strictEqual(r.hasConnection(0, 1), true)
    strictEqual(r.hasConnection(1, 0), true)
    strictEqual(r.getConnectionPlayer(0, 1), -1)

    r.addConnection(2, 0)
    strictEqual(r.hasConnection(0, 2), true)
    strictEqual(r.hasConnection(2, 0), true)
    strictEqual(r.getConnectionPlayer(0, 2), -1)

    let r2 = r as RoadNetwork
    const temp = r2.adjacentTo(0)
    strictEqual(temp.includes(1), true)
    strictEqual(temp.includes(2), true)

    r2.buildRoad(1, 0, 0)
    strictEqual(r2.getRoad(0, 1), 0)
    strictEqual(r2.getRoad(1, 0), 0)
    strictEqual(r2.getRoad(0, 2), -1)
    r2.buildRoad(1, 0, 1)
    strictEqual(r2.getRoad(0, 1), 0)
    strictEqual(r2.getRoad(1, 0), 0)
    strictEqual(r2.getRoad(0, 2), -1)
  })
})
