import { NUM_CITIES, NUM_ROADS, NUM_SETTLEMENTS } from './constants'
import ResourceBundle from './resource_bundle'

export class Player {
  readonly resources: ResourceBundle
  public victoryPoints: number
  public cities: number
  public settlements: number
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
