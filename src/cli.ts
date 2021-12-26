var readline = require('readline')
import Action, { ActionType } from './game/action'
import Game from './game/game'

const game = new Game()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const parseAction = (line: string): Action => {
  return new Action(ActionType.Roll)
}

rl.on('line', (line: string) => {
  game.handleAction(parseAction(line))
  console.log(game.toLog())
  process.stdout.write('$ ')
})

console.log(game.toLog())
process.stdout.write('$ ')
