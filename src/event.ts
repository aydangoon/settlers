/**
 * Defineds and declares the Event class.
 * @module
 */
import Action from './action'

/**
 * An event is a atomic, deterministic result of an action that can be applied
 * to a game's state to update it.
 */
export class Event {
  /**
   * The action associated with this event. Often, all the information we want
   * about an event is contained within its `action` field.
   */
  readonly action: Action

  constructor(action: Action) {
    this.action = action
  }

  public toJSON() {
    return JSON.stringify(this)
  }
}

/**
 * A roll event. Includes a `value` field for the dice's sum.
 */
export class RollEvent extends Event {
  /** The value we rolled */
  readonly value: number
  constructor(value: number, action: Action) {
    super(action)
    this.value = value
  }
}

export default Event
