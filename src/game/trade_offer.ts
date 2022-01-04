import { NUM_PLAYERS } from './constants'
import Loggable from './loggable'
import ResourceBundle from './resource/resource_bundle'

export enum TradeStatus {
  Pending,
  Accept,
  Decline,
}
export class TradeOffer implements Loggable {
  /** Unique number for the trade offer */
  readonly id: number
  /** Player number who is making the offer. */
  readonly offerer: number
  /** What is offered. */
  readonly offer: ResourceBundle
  /** What is requested in return. */
  readonly request: ResourceBundle
  /** How each player number views the trade. */
  readonly status: {
    [key: number]: TradeStatus
  }
  /** Declines needed to automatically close the trade */
  private maxDeclines: number

  constructor(
    id: number,
    host: number,
    offerer: number,
    offer: ResourceBundle,
    request: ResourceBundle
  ) {
    const isHost = host === offerer
    this.id = id
    this.offerer = offerer
    this.offer = offer
    this.request = request
    this.maxDeclines = isHost ? NUM_PLAYERS - 1 : 1
    if (!isHost) {
      this.status = { [host]: TradeStatus.Pending }
    } else {
      this.status = {}
      for (let i = 0; i < NUM_PLAYERS; i++) {
        if (i === host) continue
        this.status[i] = TradeStatus.Pending
      }
    }
  }

  public allDeclined = () => {
    let count = 0
    for (let status in this.status) {
      if (this.status[status] === TradeStatus.Decline) count++
    }
    return count === this.maxDeclines
  }

  toLog = () => ''
  // `{\nid: ${this.id}, offerer: ${this.offerer}\nstatus: ${this.status
  //   .map((elt) => {
  //     if (elt === TradeStatus.Accept) return 'Accept'
  //     else if (elt === TradeStatus.Decline) return 'Decline'
  //     return 'Pending'
  //   })
  //   .join(', ')}\noffer: [ ${this.offer.toLog()} ] request: [ ${this.request.toLog()} ]\n}`
}

export default TradeOffer
