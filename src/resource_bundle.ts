import Resource from './resource'

/**
 * A collection of resources.
 */
class ResourceBundle {
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
}

export default ResourceBundle
