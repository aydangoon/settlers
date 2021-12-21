import { notStrictEqual, strictEqual } from 'assert'
import chai from 'chai'
import RoadNetwork from '../../src/board/road_network'

describe('road network', () => {
  it('check connections', () => {
    const r: any = new RoadNetwork()
    strictEqual(r.hasConnection(0, 1), true)
    strictEqual(r.hasConnection(1, 0), true)
    strictEqual(r.hasConnection(0, 8), true)
    strictEqual(r.hasConnection(8, 0), true)
    strictEqual(r.hasConnection(0, 2), false)
    strictEqual(r.hasConnection(2, 0), false)

    chai.expect(r.children(1)).to.have.members([0, 2])
    chai.expect(r.children(2)).to.have.members([1, 3, 10])
    chai.expect(r.children(9)).to.have.members([10, 8, 19])
    chai.expect(r.children(28)).to.have.members([27, 29, 38])
    chai.expect(r.children(27)).to.have.members([16, 28])
    chai.expect(r.children(53)).to.have.members([45, 52])
  })

  it('public interface works', () => {
    const r = new RoadNetwork()
    chai.expect(r.adjacentTo(31)).to.have.members([30, 32, 20])

    strictEqual(r.getRoad(1, 2), -1)
    strictEqual(r.getRoad(2, 1), -1)
    r.buildRoad(1, 2, 0)
    strictEqual(r.getRoad(1, 2), 0)
    strictEqual(r.getRoad(2, 1), 0)

    strictEqual(r.getRoad(0, 2), -1)
    r.buildRoad(0, 2, 0)
    strictEqual(r.getRoad(0, 2), -1)
  })
})
