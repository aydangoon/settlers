var readline = require('readline')
import Action, { ActionType, actionTypeStr } from './game/action'
import Game from './game/game'
import ResourceBundle from './game/resource/resource_bundle'

const game = new Game()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const parseAction = (line: string): Action => {
  const args = line.split(' ')
  const type = parseInt(args[0])
  switch (type) {
    case ActionType.Exchange:
      return new Action(type, game.turn, { offer: args[1], request: args[2] })
    case ActionType.MakeTradeOffer:
      return new Action(type, game.turn, {
        offer: new ResourceBundle(args.slice(1, 6).map(parseInt)),
        request: new ResourceBundle(args.slice(6).map(parseInt)),
      })
    case ActionType.DecideOnTradeOffer:
      return new Action(type, game.turn, {
        status: parseInt(args[1]),
        id: parseInt(args[2]),
        withPlayer: args[3] ? parseInt(args[3]) : undefined,
      })
    case ActionType.Discard:
      return new Action(type, game.turn, {
        bundle: new ResourceBundle(args.slice(1, 6).map(parseInt)),
      })
    case ActionType.MoveRobber:
      return new Action(type, game.turn, {
        to: parseInt(args[1]),
      })
    case ActionType.Rob:
      return new Action(type, game.turn, {
        victim: parseInt(args[1]),
      })
    case ActionType.SelectMonopolyResource:
      return new Action(type, game.turn, { resource: parseInt(args[1]) })
    case ActionType.SelectYearOfPlentyResources:
      return new Action(type, game.turn, { resources: [parseInt(args[1]), parseInt(args[2])] })
    case ActionType.BuildCity:
    case ActionType.BuildSettlement:
      return new Action(type, game.turn, { node: parseInt(args[1]) })
    case ActionType.BuildRoad:
      return new Action(type, game.turn, { node0: parseInt(args[1]), node1: parseInt(args[2]) })
    default:
      return new Action(type, game.turn)
  }
}

let opts: string = ''
for (let i = 0; i < 18; i++) opts += `${i}: ${actionTypeStr(i)}, `

let prompt = '$ '

rl.on('line', (line: string) => {
  const action = game.handleAction(parseAction(line))
  if (action === null) {
    console.log('action failed.')
    process.stdout.write(prompt)
  } else {
    console.clear()
    console.log(game.toLog())
    console.log(opts)
    process.stdout.write(prompt)
  }
})

console.clear()
console.log(game.toLog())
console.log(opts)
process.stdout.write(prompt)
