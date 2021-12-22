import { NUM_CITIES, NUM_ROADS, NUM_SETTLEMENTS } from './constants'
import DevCardBundle from './dev_card_bundle'
import Loggable from './loggable'
import ResourceBundle from './resource_bundle'

export class Player implements Loggable {
  /** The players resources. */
  readonly resources: ResourceBundle
  /** The players dev cards. */
  readonly devCards: DevCardBundle
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
    this.devCards = new DevCardBundle()
    this.victoryPoints = 0
    this.cities = NUM_CITIES
    this.settlements = NUM_SETTLEMENTS
    this.roads = NUM_ROADS
  }

  toLog = () =>
    `resources: [ ${this.resources.toLog()} ], devCards: [ ${this.devCards.toLog()} ], vps: ${
      this.victoryPoints
    } cities: ${this.cities} settlements: ${this.settlements} roads: ${
      this.roads
    }`
}

export default Player
