import assert from 'assert'
import DevCard from '../src/dev_card'
import DevCardBundle from '../src/dev_card_bundle'

describe('new ResourceBundle()', () => {
  it('should create an empty bundle', () => {
    const b = new DevCardBundle()
    assert.strictEqual(b.isEmpty(), true)
  })
})

describe('remove()', () => {
  it('dev cards should be empty', () => {
    const b = new DevCardBundle([0, 1, 0, 0, 0])
    assert.strictEqual(b.isEmpty(), false)
    b.remove(DevCard.VictoryPoint)
    assert.strictEqual(b.isEmpty(), true)
  })
})

describe('add()', () => {
  it('adds a knight', () => {
    const b = new DevCardBundle()
    assert.strictEqual(b.isEmpty(), true)
    b.add(DevCard.Knight)
    assert.strictEqual(b.isEmpty(), false)
    assert.strictEqual(b.has(DevCard.Knight), true)
  })
})

describe('removeOneAtRandom()', () => {
  it('removes a monopoly and vp', () => {
    const b = new DevCardBundle([0, 1, 0, 1, 0])
    assert.strictEqual(b.isEmpty(), false)
    const elt = b.pickOneAtRandom()
    b.remove(elt)
    const elt2 = b.pickOneAtRandom()
    b.remove(elt2)
    const things = [elt, elt2]
    assert.strictEqual(things.includes(DevCard.VictoryPoint), true)
    assert.strictEqual(things.includes(DevCard.Monopoly), true)
  })
})
