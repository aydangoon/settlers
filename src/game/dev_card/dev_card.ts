/**
 * DevCard. each maps to a number so it can be used to index dev card bundles.
 */
export enum DevCard {
  Knight,
  VictoryPoint,
  YearOfPlenty,
  Monopoly,
  RoadBuilder,
}

/**
 * Get the string representation of a dev card.
 * @param c The Dev card.
 * @returns The string representation.
 */
export const devCardStr = (c: DevCard) => {
  switch (c) {
    case DevCard.Knight:
      return 'knight'
    case DevCard.VictoryPoint:
      return 'victory point'
    case DevCard.YearOfPlenty:
      return 'year of plenty'
    case DevCard.Monopoly:
      return 'monopoly'
    default:
      return 'road builder'
  }
}

export default DevCard
