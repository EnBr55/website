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
  let snakes = []
  let generation = 1

  // SIMULATION VARIABLES
  let simulationSpeed = 20
  let showEyes = false
  let mutationRate = 0.3
  let windowDimensions = {
    width: p5.windowWidth / 1.3,
    height: p5.windowHeight / 1.3,
  }
  let numSnakes = 20
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
        if (other.getActive()) {
          caller.die()
        }
      },
    },
  ]

  // takes array of array of snake objects coupled with fitness
  let sortSnakes = (array) => {
    function comparator(a, b) {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    }
    let sorted = array
    sorted = sorted.sort(comparator)
    return sorted.reverse()
  }

  const breed = pool => {
    let sortedSnakes = sortSnakes(pool)
    let newSnakes = []

    for (let i = 0; i < Math.floor(sortedSnakes.length / 2); i++) {
      // push parent back in with no mutations to DNA
      newSnakes.push(
        new Snake(
          (Math.random() * windowDimensions.width) / 1.5,
          (Math.random() * windowDimensions.height) / 1.5,
          mutate(sortedSnakes[i][0].dna, 0)
        )
      )

      // parent creates a child with mutations to dna
      newSnakes.push(
        new Snake(
          (Math.random() * windowDimensions.width) / 1.5,
          (Math.random() * windowDimensions.height) / 1.5,
          mutate(sortedSnakes[i][0].dna, Math.random())
        )
      )
    }
    return newSnakes
  }

  // ------- MAIN LOOP ------- //

  let alive
  p5.draw = () => {
    p5.background(15)
    p5.textSize(14)

    alive = snakes.filter(t => t.getAlive()).length
    p5.fill('red')
    p5.text('Generation: ' + generation + ' | Alive: ' + alive, 5, 15)

    if (alive === 0) {
      let oldSnakes = []
      let averageFitness = 0
      for (let snake of snakes) {
        oldSnakes.push([snake, snake.getFitness()])
        averageFitness += snake.getFitness()
      }
      averageFitness /= snakes.length

      console.log(
        `Generation ${generation} finished.
         Average Fitness: ${averageFitness}.
         Beginning generation ${generation + 1}`,
      )

      snakes = breed(oldSnakes)
      targets[0].target = snakes
      generation++
      if (generation > 40) { simulationSpeed = 1}
    }

    for (let i = 0; i < simulationSpeed; i++) {
      for (let snake of snakes) {
        if (snake.getShouldUpdate()) {
          if (simulationSpeed < 5) {
          snake.draw(p5)
          }
          snake.update(windowDimensions, targets)
        }
      }
    }
  }
}
