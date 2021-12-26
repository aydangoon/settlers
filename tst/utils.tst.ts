import { notStrictEqual, strict, strictEqual } from 'assert'
import chai from 'chai'
import Graph from '../src/board/graph'
import { breadthFirstSearch, connectedComponents, maxTrail } from '../src/utils'

describe('graph basic tests', () => {
  it('works :)', () => {
    const g = new Graph<number>([
      [0, 1],
      [1, 2],
    ])
    strictEqual(g.nodeCount(), 3)
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
    const g = new Graph<number>([
      [0, 1],
      [1, 2],
      [2, 0],
    ])
    const b = breadthFirstSearch<number>(g, 0)
    chai.expect([...b.visited]).to.have.members([0, 1, 2])
    strictEqual(b.depth, 1)
  })

  it('works for more advanced tests', () => {
    const g = new Graph<number>([
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 3],
      [3, 4],
      [5, 6],
    ])
    const b = breadthFirstSearch<number>(g, 0)
    chai.expect([...b.visited]).to.have.members([0, 1, 2, 3, 4])
    strictEqual(b.depth, 3)
  })
})

describe('connectedComponents()', () => {
  it('works for 1 cc', () => {
    const g = new Graph<number>([
      [0, 1],
      [1, 2],
    ])
    const ccs = connectedComponents(g)
    strictEqual(ccs.length, 1)
    strictEqual(ccs[0].hasEdge(0, 1), true)
    strictEqual(ccs[0].hasEdge(2, 1), true)
  })

  it('works for multiple cc', () => {
    const g = new Graph<number>([
      [0, 1],
      [1, 2],
      [4, 5],
      [6, 7],
    ])
    const ccs = connectedComponents(g)
    strictEqual(ccs.length, 3)
    strictEqual(ccs[0].hasEdge(0, 1), true)
    strictEqual(ccs[0].hasEdge(1, 2), true)
  })
})

describe('maxTrail()', () => {
  it('works :)', () => {
    const g = new Graph<number>([
      [0, 1],
      [1, 2],
      [2, 0],
    ])
    strictEqual(maxTrail(g, 0), 3)

    const hex = new Graph<number>([
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [5, 6],
      [6, 7],
    ])
    strictEqual(maxTrail(hex, 7), 8)
  })

  it('works for double hex problem', () => {
    const g = new Graph<number>([
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],

      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
      [9, 4],
      [7, 10],
      [10, 11],
    ])
    strictEqual(maxTrail(g, 11), 12)
  })
})
