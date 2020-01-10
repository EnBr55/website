import { NeuralNet, matrixConstructor, mutate, crossOver } from './NeuralNet'
import math from 'mathjs'
import Snake from './Snake'

export const SnakeSim = (p5) => {

  // WORLD VARIABLES
  const snakes = [new Snake(50, 50)]
  let generation = 0

  // SIMULATION VARIABLES
  let simulationSpeed = 1
  let showEyes = false
  let mutationRate = 0.3
  let windowDimensions = {width: p5.windowWidth / 1.3, height: p5.windowHeight / 1.3}

  p5.setup = () => {
    p5.createCanvas(windowDimensions.width, windowDimensions.height)
    p5.frameRate(60)
  }

  p5.draw = () => {
    p5.background(51)
    p5.textSize(14)
    p5.fill('red')
    p5.text(
      'Generation: '+generation+' | Alive: '+snakes.length,
      5, 15
    )
    for (let snake of snakes) {
      snake.draw(p5)
      snake.update(windowDimensions)
      snake.dir += 0.01
      // snake.update()
      // if (true) {
      //   snake.draw()
      // }
    }
  }
  
}
