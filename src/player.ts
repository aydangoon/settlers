import { NUM_CITIES, NUM_ROADS, NUM_SETTLEMENTS } from './constants'
import ResourceBundle from './resource_bundle'

export class Player {
  /** The players resources. */
  readonly resources: ResourceBundle
  /** Number of victory points. */
  public victoryPoints: number
  /** Number of cities that can be built. */
  public cities: number
  /** Number of settlements that can be built.  */
  public settlements: number
  /** Number of roads that can be built. */
  public roads: number

  constructor() {
    this.resources = new ResourceBundle()
    this.victoryPoints = 0
    this.cities = NUM_CITIES
    this.settlements = NUM_SETTLEMENTS
    this.roads = NUM_ROADS
  }
}

export default Player
