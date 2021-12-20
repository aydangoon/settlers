import Resource from './resource'
import { NUM_RESOURCE_TYPES } from './constants'

/**
 * A collection of resources.
 */
export class ResourceBundle {
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
      this.bundle = new Array(NUM_RESOURCE_TYPES).fill(0) as number[]
    } else if (typeof args[0] === 'number') {
      const [amnt] = args as [number]
      this.bundle = new Array(NUM_RESOURCE_TYPES).fill(amnt) as number[]
    } else {
      const [amnts] = args as [number[]]
      this.bundle = new Array(NUM_RESOURCE_TYPES) as number[]
      for (let i = 0; i < NUM_RESOURCE_TYPES; i++) this.bundle[i] = amnts[i]
    }
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
  public subtract(bundle: ResourceBundle) {
    for (let i = 0; i < NUM_RESOURCE_TYPES; i++) {
      this.bundle[i] -= bundle.get(i)
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
   *
   * @returns A boolean indicating if the bundle has no resources.
   */
  public isEmpty() {
    return this.bundle.reduce((acc, curr) => acc + curr) == 0
  }
}

export default ResourceBundle
