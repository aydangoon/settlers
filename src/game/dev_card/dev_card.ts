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
      return 'Knight'
    case DevCard.VictoryPoint:
      return 'Victory Point'
    case DevCard.YearOfPlenty:
      return 'Year of Plenty'
    case DevCard.Monopoly:
      return 'Monopoly'
    default:
      return 'Road Builder'
  }
}

export default DevCard
