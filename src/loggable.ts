/**
 * Interface declaring the class loggable. Every class that
 * implements this interface must implement a method `toLog` which
 * returns a string of the class' state.
 */
export interface Loggable {
  toLog: () => string
}

export default Loggable
