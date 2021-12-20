import Resource from './resource'

/**
 * A collection of resources.
 */
export class ResourceBundle {
  private bundle: [number, number, number, number, number]
  constructor(amnt: number = 0) {
    this.bundle = [amnt, amnt, amnt, amnt, amnt]
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
  public add(bundle: ResourceBundle) {
    for (let i = 0; i < 5; i++) {
      this.bundle[i] += bundle.get(i)
    }
  }
}

export default ResourceBundle
