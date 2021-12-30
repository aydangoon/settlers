import Resource, { resStr } from './resource'
import { NUM_RESOURCE_TYPES } from '../constants'
import { weightedRandom } from '../utils'
import Loggable from '../loggable'

/**
 * A collection of resources.
 */
export class ResourceBundle implements Loggable {
  private bundle: number[]

  /**
   * Initializes an empty bundle.
   */
  constructor()
  /**
   * Initialize a bundle with `amnt` of each resource.
   * @param amnt The amount we want of each resource.
   */
  constructor(amnt: number)
  /**
   * Initialize a bundle with `amnt[i]` of resource `i`.
   * @param amnts The amounts we want for each resource.
   */
  constructor(amnts: number[])

  constructor(...args: any[]) {
    if (args.length === 0) {
      this.bundle = [...Array(NUM_RESOURCE_TYPES)].map(() => 0) as number[]
    } else if (typeof args[0] === 'number') {
      const [amnt] = args as [number]
      this.bundle = [...Array(NUM_RESOURCE_TYPES)].map(() => amnt) as number[]
    } else {
      const [amnts] = args as [number[]]
      this.bundle = [...Array(NUM_RESOURCE_TYPES)] as number[]
      for (let i = 0; i < NUM_RESOURCE_TYPES; i++) this.bundle[i] = amnts[i]
    }
  }

  /**
   * Determine if `bundle` is a subset of this bundle.
   * @param bundle
   * @returns boolean indicating if `bundle` is a subset.
   */
  public has(bundle: ResourceBundle): boolean {
    for (let i = 0; i < NUM_RESOURCE_TYPES; i++) {
      if (this.bundle[i] < bundle.get(i)) return false
    }
    return true
  }
  /**
   *
   * @param resource The resource we want the amount of.
   * @returns The number of resource `resource` in the bundle.
   */
  public get(resource: Resource) {
    return this.bundle[resource]
  }

  /**
   * Set the amount of a resource to resource.
   * @param resource The resource to set the amount of.
   * @param amnt The amount.
   */
  public set(resource: Resource, amnt: number) {
    this.bundle[resource] = amnt
  }

  /**
   *
   * @param bundle The bundle we wish to add to this bundle. It is unchanged.
   */
  public add(bundle: ResourceBundle): void
  /**
   *
   * @param resource The resource we with to add to this bundle.
   * @param amnt The amount of the resource we wish to add.
   */
  public add(resource: Resource, amnt: number): void
  public add(...args: any[]) {
    if (args.length === 1) {
      const [bundle] = args as [ResourceBundle]
      for (let i = 0; i < NUM_RESOURCE_TYPES; i++) {
        this.bundle[i] += bundle.get(i)
      }
    } else {
      const [resource, amnt] = args as [Resource, number]
      this.bundle[resource] += amnt
    }
  }

  /**
   *
   * @param bundle The bundle we with to subtract from this bundle. It is unchanged.
   */
  public subtract(bundle: ResourceBundle): void
  public subtract(resource: Resource, amnt: number): void
  public subtract(...args: any[]) {
    if (args.length === 1) {
      const [bundle] = args as [ResourceBundle]
      for (let i = 0; i < NUM_RESOURCE_TYPES; i++) {
        this.bundle[i] -= bundle.get(i)
      }
    } else {
      const [resource, amnt] = args as [Resource, number]
      this.add(resource, -1 * amnt)
    }
  }

  /**
   * Make a trade between two bundles.
   * @param fromOffereeBundle What is expected in return from the offeree.
   * @param offereeBundle The offeree's bundle.
   * @param fromOffererBundle What is offered by the offerer.
   * @param offererBundle The offerer's bundle.
   */
  public static trade(
    fromOffereeBundle: ResourceBundle,
    offereeBundle: ResourceBundle,
    fromOffererBundle: ResourceBundle,
    offererBundle: ResourceBundle
  ) {
    // Give the offeree what is offered from the offerer.
    offereeBundle.add(fromOffererBundle)
    offererBundle.subtract(fromOffererBundle)

    // Give the offerer what was expected in return from the offeree.
    offererBundle.add(fromOffereeBundle)
    offereeBundle.subtract(fromOffereeBundle)
  }

  /**
   * Get the amount of Resource `resource` held by the bundle and set it to 0.
   * @param resource The resource we want to take.
   * @returns The amount of `resource` the bundle had.
   */
  public removeAll(resource: Resource) {
    const temp = this.bundle[resource]
    this.bundle[resource] = 0
    return temp
  }

  /**
   * Remove one resource from the bundle at random.
   * @returns The resource that was randomly removed.
   */
  public removeOneAtRandom() {
    const resToRemove = weightedRandom(this.bundle) as Resource
    this.bundle[resToRemove]--
    return resToRemove
  }

  /**
   *
   * @returns The number of resources in the bundle.
   */
  public size() {
    let sum = 0
    for (let i = 0; i < NUM_RESOURCE_TYPES; i++) {
      sum += this.bundle[i]
    }
    return sum
  }

  /**
   *
   * @returns A boolean indicating if the bundle has no resources.
   */
  public isEmpty() {
    return this.size() === 0
  }

  public static roadCost = new ResourceBundle([1, 1, 0, 0, 0])
  public static settlementCost = new ResourceBundle([1, 1, 0, 1, 1])
  public static cityCost = new ResourceBundle([0, 0, 3, 2, 0])
  public static devCardCost = new ResourceBundle([0, 0, 1, 1, 1])

  toLog = () => this.bundle.map((amnt, i) => `${resStr(i)}: ${amnt}`).join(', ')
}

export default ResourceBundle
