import { notStrictEqual, strictEqual } from 'assert'
import chai from 'chai'
import Board from '../../src/board/board'
import Tile from '../../src/board/tile'
import { NUM_EACH_RESOURCE_TILE } from '../../src/constants'
import Resource from '../../src/resource'

describe('board', () => {
  it('setup is valid.', () => {
    const b = new Board()

    chai.expect(b.tiles[0].nodes).to.have.members([0, 1, 2, 8, 9, 10])
    chai.expect(b.tiles[2].nodes).to.have.members([4, 5, 6, 12, 13, 14])
    chai.expect(b.tiles[4].nodes).to.have.members([9, 10, 11, 19, 20, 21])
    chai.expect(b.tiles[9].nodes).to.have.members([20, 21, 22, 31, 32, 33])
    chai.expect(b.tiles[18].nodes).to.have.members([43, 44, 45, 51, 52, 53])

    //Robber is on desert and desert has 7.
    notStrictEqual(b.robber, -1)
    const rt: Tile = b.tiles[b.robber]
    strictEqual(rt.getNumber(), 7)
    strictEqual(rt.resource, Resource.None)

    // Amounts of each tile resource are correct
    chai
      .expect(b.tiles.filter((tile) => tile.resource === Resource.Ore).length)
      .eqls(NUM_EACH_RESOURCE_TILE[Resource.Ore])
    chai
      .expect(b.tiles.filter((tile) => tile.resource === Resource.Brick).length)
      .eqls(NUM_EACH_RESOURCE_TILE[Resource.Brick])
    chai
      .expect(b.tiles.filter((tile) => tile.resource === Resource.Lumber).length)
      .eqls(NUM_EACH_RESOURCE_TILE[Resource.Lumber])
    chai
      .expect(b.tiles.filter((tile) => tile.resource === Resource.Grain).length)
      .eqls(NUM_EACH_RESOURCE_TILE[Resource.Grain])
    chai
      .expect(b.tiles.filter((tile) => tile.resource === Resource.Wool).length)
      .eqls(NUM_EACH_RESOURCE_TILE[Resource.Wool])

    chai.expect(b.tiles.filter((tile) => tile.resource === Resource.None).length).eqls(1)

    // Amounts of each number token are correct.
    const temp = [1, 2, 2, 2, 2]
    const tokens = [...temp, 1, ...temp.reverse()]
    for (let i = 0; i < b.tiles.length; i++) {
      const num = b.tiles[i].getNumber()
      notStrictEqual(num, -1)
      tokens[num - 2]--
    }
    strictEqual(
      tokens.find((elt) => elt !== 0),
      undefined
    )
  })
})

describe('board longestRoad one cc', () => {
  it('works for cases 0, 1', () => {
    const b = new Board()
    strictEqual(b.getRoad(0, 1), -1)
    // Case 1
    b.buildRoad(0, 1, 0)
    b.buildRoad(1, 2, 0)
    strictEqual(b.getLongestRoad(0), 2)
    b.buildRoad(2, 10, 0)
    strictEqual(b.getLongestRoad(0), 3)

    // Case 0
    b.buildRoad(10, 9, 0)
    strictEqual(b.getRoad(10, 9), 0)
    b.buildRoad(9, 8, 0)
    strictEqual(b.getRoad(8, 9), 0)
    b.buildRoad(8, 0, 0)
    strictEqual(b.getRoad(8, 0), 0)
    strictEqual(b.getLongestRoad(0), 6)
  })

  it('works for case 2a', () => {
    const b = new Board()
    b.buildRoad(0, 1, 0)
    b.buildRoad(1, 2, 0)
    b.buildRoad(2, 10, 0)
    b.buildRoad(10, 11, 0)
    b.buildRoad(11, 21, 0)
    strictEqual(b.getLongestRoad(0), 5)
  })

  it('works for case 2b simple', () => {
    const b = new Board()
    b.buildRoad(0, 1, 0)
    b.buildRoad(1, 2, 0)
    b.buildRoad(2, 10, 0)
    b.buildRoad(10, 9, 0)
    b.buildRoad(9, 8, 0)
    b.buildRoad(8, 0, 0)
    b.buildRoad(7, 8, 0)
    b.buildRoad(17, 7, 0)
    strictEqual(b.getLongestRoad(0), 8)
  })

  it('works for case 2b complex', () => {
    const b = new Board()
    for (let i = 0; i < 4; i++) {
      b.buildRoad(i, i + 1, 0)
      b.buildRoad(i + 8, i + 9, 0)
    }
    b.buildRoad(0, 8, 0)
    b.buildRoad(2, 10, 0)
    b.buildRoad(4, 12, 0)
    strictEqual(b.getLongestRoad(0), 11)

    b.buildRoad(12, 13, 0)
    b.buildRoad(13, 14, 0)
    strictEqual(b.getLongestRoad(0), 12)
  })
})

describe('board longestRoad multiple cc', () => {
  it('works for cases 0, 1', () => {
    const b = new Board()
    strictEqual(b.getRoad(0, 1), -1)
    // Case 1
    b.buildRoad(0, 1, 0)
    b.buildRoad(1, 2, 0)

    // build an arbitrary random road somewhere else
    b.buildRoad(27, 28, 0)
    strictEqual(b.getRoad(27, 28), 0)

    strictEqual(b.getLongestRoad(0), 2)
    b.buildRoad(2, 10, 0)
    strictEqual(b.getLongestRoad(0), 3)

    // Case 0
    b.buildRoad(10, 9, 0)
    b.buildRoad(9, 8, 0)
    b.buildRoad(8, 0, 0)
    strictEqual(b.getLongestRoad(0), 6)
  })
})

describe('road interrupted by a settlement', () => {
  it('splits the road', () => {
    const b = new Board()
    b.buildRoad(0, 1, 0)
    b.buildRoad(1, 2, 0)
    strictEqual(b.getLongestRoad(0), 2)
    b.nodes[1].buildSettlement(1)
    strictEqual(b.getLongestRoad(0), 1)
    strictEqual(b.getLongestRoad(1), 0)
  })
})

// describe('board log', () => {
//   it('looks nice?', () => {
//     const b = new Board()
//     console.log(b.toLog())
//   })
// })
