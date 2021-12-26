import { BANK_RATE, NUM_CITIES, NUM_ROADS, NUM_SETTLEMENTS } from './constants'
import DevCardBundle from './dev_card/dev_card_bundle'
import Loggable from './loggable'
import ResourceBundle from './resource/resource_bundle'

export class Player implements Loggable {
  /** The players resources. */
  readonly resources: ResourceBundle
  /** The rates at which a player can exchange a resource for any with the bank. */
  readonly rates: ResourceBundle
  /** The players dev cards. */
  readonly devCards: DevCardBundle
  /** Knights player. */
  public knightsPlayed: number
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
    this.rates = new ResourceBundle(BANK_RATE)
    this.devCards = new DevCardBundle()
    this.knightsPlayed = 0
    this.victoryPoints = 0
    this.cities = NUM_CITIES
    this.settlements = NUM_SETTLEMENTS
    this.roads = NUM_ROADS
  }

  toLog = () =>
    `resources: [ ${this.resources.toLog()} ], devCards: [ ${this.devCards.toLog()} ], vps: ${
      this.victoryPoints
    } cities: ${this.cities} settlements: ${this.settlements} roads: ${this.roads}`
}

export default Player
