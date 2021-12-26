/**
 * Resources. each maps to a number so it can be used to index resource bundles.
 */
export enum Resource {
  Brick,
  Lumber,
  Ore,
  Grain,
  Wool,
  None,
}
/**
 * Get a string representation of a resource.
 * @param res The resource.
 * @returns A string representation of the resource.
 */
export const resStr = (res: Resource) => {
  switch (res) {
    case Resource.Brick:
      return 'brick'
    case Resource.Lumber:
      return 'lumber'
    case Resource.Ore:
      return 'ore'
    case Resource.Grain:
      return 'grain'
    case Resource.Wool:
      return 'wool'
    default:
      'none'
  }
}

export default Resource
