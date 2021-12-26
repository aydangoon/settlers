import { NUM_PLAYERS } from './constants'
import ResourceBundle from './resource/resource_bundle'

export enum TradeStatus {
  Pending,
  Accept,
  Decline,
}

export class TradeOffer {
  /** Unique number for the trade offer */
  readonly id: number
  /** Player number who is making the offer. */
  readonly offerer: number
  /** What is offered. */
  readonly offer: ResourceBundle
  /** What is requested in return. */
  readonly request: ResourceBundle
  /** How each player number views the trade. */
  readonly status: TradeStatus[]

  constructor(id: number, offerer: number, offer: ResourceBundle, request: ResourceBundle) {
    this.id = id
    this.offerer = offerer
    this.offer = offer
    this.request = request
    this.status = [...Array(NUM_PLAYERS)].map(() => TradeStatus.Pending)
    this.status[offerer] = TradeStatus.Accept
  }

  public allDeclined = () =>
    this.status.filter((e) => e === TradeStatus.Decline).length === NUM_PLAYERS - 1
}

export default TradeOffer
