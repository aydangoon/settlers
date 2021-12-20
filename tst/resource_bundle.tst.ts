import assert, { strict, strictEqual } from 'assert'
import Resource from '../src/resource'
import ResourceBundle from '../src/resource_bundle'

describe('new ResourceBundle()', () => {
  it('should create an empty bundle', () => {
    const b: ResourceBundle = new ResourceBundle()
    assert.strictEqual(b.get(Resource.Grain), 0)
  })
})

describe('new ResourceBundle(3)', () => {
  it('should create a bundle with 3 resources per', () => {
    const b: ResourceBundle = new ResourceBundle(3)
    assert.strictEqual(b.get(Resource.Lumber), 3)
  })
})

describe('add()', () => {
  it('should create have 1 + 2 resources', () => {
    const b: ResourceBundle = new ResourceBundle(2)
    const b2: ResourceBundle = new ResourceBundle(1)
    b.add(b2)
    assert.strictEqual(b.get(Resource.Lumber), 3)
    assert.strictEqual(b.get(Resource.Brick), 3)
    assert.strictEqual(b.get(Resource.Wool), 3)
    assert.strictEqual(b.get(Resource.Grain), 3)
  })
})

describe('isEmpty()', () => {
  it('returns true for empty bundle', () => {
    assert.strictEqual(new ResourceBundle().isEmpty(), true)
  })
})

describe('subtract()', () => {
  it('should create an empty bundle', () => {
    const b: ResourceBundle = new ResourceBundle(2)
    const b2: ResourceBundle = new ResourceBundle(2)
    b.subtract(b2)
    assert.strictEqual(b.get(Resource.Lumber), 0)
    assert.strictEqual(b2.get(Resource.Grain), 2)
    assert.strictEqual(b.isEmpty(), true)
  })
})

describe('trade()', () => {
  it('should transfer resources', () => {
    const offerer: ResourceBundle = new ResourceBundle(2)
    const offeree: ResourceBundle = new ResourceBundle(1)
    const offer: ResourceBundle = new ResourceBundle([0, 2, 0, 0, 0])
    ResourceBundle.trade(new ResourceBundle(), offeree, offer, offerer)
    assert.strictEqual(offeree.get(Resource.Lumber), 3)
    assert.strictEqual(offeree.get(Resource.Grain), 1)
    assert.strictEqual(offerer.get(Resource.Lumber), 0)
    assert.strictEqual(offerer.get(Resource.Grain), 2)
  })
})

describe('removeAll()', () => {
  it('should have no grain', () => {
    const b = new ResourceBundle(4)
    const amnt = b.removeAll(Resource.Grain)
    assert.strictEqual(amnt, 4)
    assert.strictEqual(b.get(Resource.Grain), 0)
  })
})

describe('removeOneAtRandom()', () => {
  it('should always remove lumber', () => {
    const b = new ResourceBundle([0, 2, 0, 0, 0])
    assert.strictEqual(b.removeOneAtRandom(), Resource.Lumber)
    assert.strictEqual(b.removeOneAtRandom(), Resource.Lumber)
    assert.strictEqual(b.isEmpty(), true)
  })
  it('should be empty after all removes', () => {
    const b = new ResourceBundle([0, 1, 0, 1, 1])
    b.removeOneAtRandom()
    assert.strictEqual(b.size(), 2)
    b.removeOneAtRandom()
    assert.strictEqual(b.size(), 1)
    b.removeOneAtRandom()
    assert.strictEqual(b.isEmpty(), true)
  })
})
