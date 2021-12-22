import { notStrictEqual, strict, strictEqual } from 'assert'
import chai from 'chai'
import { BFSTraveral, breadthFirstSearch, connectedComponents, Graph, maxTrail } from '../src/utils'

describe('graph basic tests', () => {
  it('works :)', () => {
    const g = new Graph([
      ['a', 'b'],
      ['b', 'c'],
    ])
    strictEqual(g.size(), 3)
    strictEqual(g.hasEdge(0, 1), true)
    strictEqual(g.hasEdge(1, 2), true)
    strictEqual(g.hasEdge(0, 2), false)
    strictEqual(g.degree(1), 2)
    strictEqual(g.degree(0), 1)
    chai.expect(g.children(1)).to.have.members([0, 2])
    chai.expect(g.children(0)).to.have.members([1])
    chai.expect(g.children(2)).to.have.members([1])
    g.deleteEdge(0, 1)
    strictEqual(g.hasEdge(0, 1), false)
  })
})

describe('breadthFirstSearch()', () => {
  it('works for basic tests :)', () => {
    const g = new Graph([
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'a'],
    ])
    const b: BFSTraveral = breadthFirstSearch(g, 0)
    chai.expect([...b.visited]).to.have.members([0, 1, 2])
    strictEqual(b.depth, 1)
  })

  it('works for more advanced tests', () => {
    const g = new Graph([
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'a'],
      ['c', 'd'],
      ['d', 'e'],
      ['f', 'g'],
    ])
    const b: BFSTraveral = breadthFirstSearch(g, 0)
    chai.expect([...b.visited]).to.have.members([0, 1, 2, 3, 4])
    strictEqual(b.depth, 3)
  })
})

describe('connectedComponents()', () => {
  it('works for 1 cc', () => {
    const g = new Graph([
      ['a', 'b'],
      ['b', 'c'],
    ])
    const ccs = connectedComponents(g)
    strictEqual(ccs.length, 1)
    strictEqual(ccs[0].hasEdge(0, 1), true)
    strictEqual(ccs[0].hasEdge(2, 1), true)
  })

  it('works for multiple cc', () => {
    const g = new Graph([
      ['a', 'b'],
      ['b', 'c'],
      ['e', 'f'],
      ['g', 'h'],
    ])
    const ccs = connectedComponents(g)
    strictEqual(ccs.length, 3)
    strictEqual(ccs[0].hasEdge(0, 1), true)
    strictEqual(ccs[0].hasEdge(1, 2), true)
  })
})

describe('maxTrail()', () => {
  it('works :)', () => {
    const g = new Graph([
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'a'],
    ])
    strictEqual(maxTrail(g, 0), 3)

    const hex = new Graph([
      ['0', '1'],
      ['1', '2'],
      ['2', '3'],
      ['3', '4'],
      ['4', '5'],
      ['5', '0'],
      ['5', '6'],
      ['6', '7'],
    ])
    strictEqual(maxTrail(hex, 7), 8)
  })

  it('works for double hex problem', () => {
    const g = new Graph([
      ['0', '1'],
      ['1', '2'],
      ['2', '3'],
      ['3', '4'],
      ['4', '5'],
      ['5', '0'],

      ['5', '6'],
      ['6', '7'],
      ['7', '8'],
      ['8', '9'],
      ['9', '4'],
      ['7', 'a'],
      ['a', 'b'],
    ])
    strictEqual(maxTrail(g, g.size() - 1), 12)
  })
})
