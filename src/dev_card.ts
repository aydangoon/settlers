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

export const devCardStr = (c: DevCard) => {
  switch (c) {
    case DevCard.Knight:
      return 'knight'
    case DevCard.VictoryPoint:
      return 'vp'
    case DevCard.YearOfPlenty:
      return 'YoP'
    case DevCard.Monopoly:
      return 'monopoly'
    default:
      return 'road builder'
  }
}

export default DevCard
