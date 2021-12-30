import DevCard, { devCardStr } from './dev_card'
import { NUM_DEV_CARD_TYPES } from '../constants'
import { weightedRandom } from '../utils'
import Loggable from '../loggable'

/**
 * A collection of devcards.
 */
export class DevCardBundle implements Loggable {
  private bundle: number[]

  /**
   * Initializes an empty bundle.
   */
  constructor()
  /**
   * Initialize a bundle with `amnt` of each devcard.
   * @param amnt The amount we want of each devcard.
   */
  constructor(amnt: number)
  /**
   * Initialize a bundle with `amnt[i]` of devcard `i`.
   * @param amnts The amounts we want for each devcard.
   */
  constructor(amnts: number[])

  constructor(...args: any[]) {
    if (args.length === 0) {
      this.bundle = [...Array(NUM_DEV_CARD_TYPES)].map(() => 0) as number[]
    } else if (typeof args[0] === 'number') {
      const [amnt] = args as [number]
      this.bundle = [...Array(NUM_DEV_CARD_TYPES)].map(() => amnt) as number[]
    } else {
      const [amnts] = args as [number[]]
      this.bundle = [...Array(NUM_DEV_CARD_TYPES)] as number[]
      for (let i = 0; i < NUM_DEV_CARD_TYPES; i++) this.bundle[i] = amnts[i]
    }
  }

  /**
   *
   * @param bundle The bundle we wish to add to this bundle. It is unchanged.
   */
  public add(bundle: DevCardBundle): void
  /**
   *
   * @param DevCard The DevCard we with to add one of to this bundle.
   */
  public add(DevCard: DevCard): void
  public add(...args: any[]) {
    if (typeof args[0] === 'object') {
      const [bundle] = args as [DevCardBundle]
      for (let i = 0; i < NUM_DEV_CARD_TYPES; i++) {
        this.bundle[i] += bundle.get(i)
      }
    } else {
      const [devCard] = args as [DevCard]
      this.bundle[devCard]++
    }
  }

  /**
   * Remove a single devcard from the bundle.
   * @param devcard The dev card to remove one of.
   */
  public remove(devcard: DevCard) {
    this.bundle[devcard]--
  }

  /**
   * Check if we have a dev card
   * @param devcard The dev card to check for.
   * @returns boolean indicating if we have this dev card.
   */
  public has(devcard: DevCard) {
    return this.bundle[devcard] !== 0
  }

  /**
   *
   * @param devcard The card we want the amount of.
   * @returns The number of card `devcard` in the bundle.
   */
  public get(devcard: DevCard) {
    return this.bundle[devcard]
  }

  /**
   * Pick one devcard from the bundle at random.
   * @returns The devcard that was randomly picked.
   */
  public pickOneAtRandom() {
    return weightedRandom(this.bundle) as DevCard
  }

  /**
   * Empties the bundle.
   */
  public empty() {
    this.bundle = [...Array(NUM_DEV_CARD_TYPES)].map(() => 0) as number[]
  }

  /**
   *
   * @returns The number of devcards in the bundle.
   */
  public size() {
    return this.bundle.reduce((acc, curr) => acc + curr)
  }

  /**
   *
   * @returns A boolean indicating if the bundle has no devcards.
   */
  public isEmpty() {
    return this.size() === 0
  }

  toLog = () => this.bundle.map((amnt, i) => `${devCardStr(i)}: ${amnt}`).join(', ')
}

export default DevCardBundle
