import assert, { strict, strictEqual } from 'assert'
import Resource from '../src/resource'
import ResourceBundle from '../src/resource_bundle'

describe('new ResourceBundle()', function () {
  it('should create an empty bundle', function () {
    const b: ResourceBundle = new ResourceBundle()
    assert.strictEqual(b.get(Resource.Grain), 0)
  })
})

describe('new ResourceBundle(3)', function () {
  it('should create a bundle with 3 resources per', function () {
    const b: ResourceBundle = new ResourceBundle(3)
    assert.strictEqual(b.get(Resource.Lumber), 3)
  })
})

describe('add()', function () {
  it('should create have 1 + 2 resources', function () {
    const b: ResourceBundle = new ResourceBundle(2)
    const b2: ResourceBundle = new ResourceBundle(1)
    b.add(b2)
    assert.strictEqual(b.get(Resource.Lumber), 3)
    assert.strictEqual(b.get(Resource.Brick), 3)
    assert.strictEqual(b.get(Resource.Wool), 3)
    assert.strictEqual(b.get(Resource.Grain), 3)
    assert.strictEqual(b.get(Resource.Ore), 3)
  })
})
