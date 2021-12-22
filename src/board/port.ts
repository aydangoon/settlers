import Resource from '../resource'

class Port {
  /** List of resources willing to be exchanged at `rate` for one. */
  readonly resources: Resource[]
  readonly rate: number

  constructor(resources: Resource[], rate: number) {
    this.resources = resources
    this.rate = rate
  }
}

export default Port
