import { NeuralNet, matrixConstructor, mutate, crossOver } from './NeuralNet'
import {
  lineLine,
  lineBox,
  colliding,
  lineSnake,
  boxSnake,
} from './SimOperations'
import math from 'mathjs'
import Snake from './Snake'

export const SnakeSim = (p5) => {
  // WORLD VARIABLES
  const snakes = []
  let generation = 0

  // SIMULATION VARIABLES
  let simulationSpeed = 1
  let showEyes = false
  let mutationRate = 0.3
  let windowDimensions = {
    width: p5.windowWidth / 1.3,
    height: p5.windowHeight / 1.3,
  }
  let numSnakes = 3
  // initial snakes (random dna)
  for (let i = 0; i < numSnakes; i++) {
    snakes.push(
      new Snake(
        (Math.random() * windowDimensions.width) / 1.5,
        (Math.random() * windowDimensions.height) / 1.5,
        undefined,
      ),
    )
  }

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth / 1.3, p5.windowHeight / 1.3)
    windowDimensions = {
      width: p5.windowWidth / 1.3,
      height: p5.windowHeight / 1.3,
    }
  }

  p5.setup = () => {
    p5.createCanvas(windowDimensions.width, windowDimensions.height)
    p5.frameRate(60)
  }

  /* The snakes' update function takes as its second argument an array
  * of 'collideable' objects.
  * Each object includes a collision checking function for both
  * the feeler(a line) and the head(a rectangle) of the snake.
  * Additionally, the response is an integer which is used by the
  * snake's neural network when the feeler collides with the object.
  * Upon collision with the head, a callback defined here can occur.
  */
  const targets = [
    {
      target: snakes,
      feelerCheck: lineSnake,
      headCheck: boxSnake,
      response: 1,
      call: (caller, other) => {
        if (other.alive) {
          caller.die()
        }
      },
    },
  ]

  // ------- MAIN LOOP ------- //

  p5.draw = () => {
    p5.background(15)
    p5.textSize(14)
    p5.fill('red')
    p5.text('Generation: ' + generation + ' | Alive: ' + snakes.length, 5, 15)

    if (snakes.length === 0) {
       
    }

    for (let i = 0; i < simulationSpeed; i++) {
      for (let snake of snakes) {
        if (snake.getShouldUpdate()) {
          snake.draw(p5)
          snake.update(windowDimensions, targets)
        }
      }
    }
  }
}
