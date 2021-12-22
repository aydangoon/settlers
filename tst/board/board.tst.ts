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
      .expect(
        b.tiles.filter((tile) => tile.resource === Resource.Lumber).length
      )
      .eqls(NUM_EACH_RESOURCE_TILE[Resource.Lumber])
    chai
      .expect(b.tiles.filter((tile) => tile.resource === Resource.Grain).length)
      .eqls(NUM_EACH_RESOURCE_TILE[Resource.Grain])
    chai
      .expect(b.tiles.filter((tile) => tile.resource === Resource.Wool).length)
      .eqls(NUM_EACH_RESOURCE_TILE[Resource.Wool])

    chai
      .expect(b.tiles.filter((tile) => tile.resource === Resource.None).length)
      .eqls(1)

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

// describe('board log', () => {
//   it('looks nice?', () => {
//     const b = new Board()
//     console.log(b.toLog())
//   })
// })
