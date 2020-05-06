import { mutate, crossOver } from './NeuralNet'
import {
  lineSnake,
  boxSnake,
  lineBox,
  colliding,
  removeElement,
} from './SimOperations'
import Snake from './Snake'
import Food from './Food'

export const SnakeSim = (p5) => {
  // WORLD VARIABLES
  let snakes = []
  let food = []
  let walls = []
  let generation = 1

  // SIMULATION VARIABLES
  let simulationSpeed = 1
  let showEyes = false
  let windowDimensions = {
    width: p5.windowWidth / 1.3,
    height: p5.windowHeight / 1.3,
  }

  const setWalls = () => { walls = [
    { pos: { x: 0, y: 0 }, width: windowDimensions.width, height: 1 },
    { pos: { x: 0, y: 0 }, width: 1, height: windowDimensions.height },
    { pos: { x: 0, y: windowDimensions.height }, width: windowDimensions.width, height: 1 },
    { pos: { x: windowDimensions.width, y: 0 }, width: 1, height: windowDimensions.height }
  ] }

  setWalls()

  let numSnakes = 15
  // initial snakes (random dna)
  for (let i = 0; i < numSnakes; i++) {
    snakes.push(
      new Snake(
        (Math.random() * (windowDimensions.width - 50)) + 50,
        (Math.random() * (windowDimensions.height - 50)) + 50,
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
    setWalls()
  }

  p5.setup = () => {
    p5.createCanvas(windowDimensions.width, windowDimensions.height)
    p5.frameRate(60)
  }

  // this function name is the fault of the p5 react wrapper : (
  p5.myCustomRedrawAccordingToNewPropsHandler = props => {
    simulationSpeed = props.simSpeed
    if (props.showEyes !== showEyes) {
      showEyes = props.showEyes
      for (let snake of snakes) {
        snake.showEyes = showEyes
      }
    }
  }

  const snakeToFood = (snake) => {
    for (let segment of snake.segments) {
      food.push(
        new Food(
          segment.pos.x,
          segment.pos.y,
          segment.width,
          segment.height,
          snake.color,
        ),
      )
    }
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
        // grace period
        if (other.getActive() && roundTimer / 60 > 1) {
          caller.die()
          if (false && generation > 40) {
            snakeToFood(caller)
          }
        }
      },
    },
    {
      target: food,
      feelerCheck: lineBox,
      headCheck: colliding,
      response: -1,
      call: (caller, other) => {
        caller.feed(caller.hunger.max / 4)
        removeElement(food, other)
      },
    },
    {
      target: walls,
      feelerCheck: lineBox,
      headCheck: colliding,
      response: 1,
      call: (caller, other) => {
        caller.die()
      },
    },
  ]

  // takes array of array of snake objects coupled with fitness
  const sortSnakes = (array) => {
    const comparator = (a, b) => {
      if (a[1] < b[1]) return -1
      if (a[1] > b[1]) return 1
      return 0
    }
    let sorted = array
    sorted = sorted.sort(comparator)
    return sorted.reverse()
  }

  const breed = (pool) => {
    let sortedSnakes = sortSnakes(pool)
    let newSnakes = []

    let numOldSnakes = Math.floor(numSnakes / 2.5)
    let numNewSnakes = numSnakes - numOldSnakes

    for (let i = 0; i < numOldSnakes; i++) {
      // push parent back in with slight mutations to DNA
      newSnakes.push(
        new Snake(
          (Math.random() * (windowDimensions.width - 50)) + 50,
          (Math.random() * (windowDimensions.height - 50)) + 50,
          mutate(sortedSnakes[i][0].dna, 0.01),
        ),
      )
    }

    for (let i = 0; i < numNewSnakes; i++) {
      // parent creates a child with more extreme mutations to dna
      newSnakes.push(
        new Snake(
          (Math.random() * (windowDimensions.width - 50)) + 50,
          (Math.random() * (windowDimensions.height - 50)) + 50,
          crossOver(
            newSnakes[i % numOldSnakes],
            newSnakes[(i + 1) % numOldSnakes],
            0.2,
          ),
        ),
      )
    }
    return newSnakes
  }

  // ------- MAIN LOOP ------- //

  let alive
  let roundTimer = 0
  p5.draw = () => {
    p5.background(15)
    p5.textSize(14)

    alive = snakes.filter((t) => t.getAlive()).length
    p5.noStroke()
    p5.fill('red')
    p5.text('Generation: ' + generation + ' | Alive: ' + alive, 5, 15)
    if (simulationSpeed > 5) {
      p5.fill('red')
      p5.noStroke()
      p5.text('Training in Progress', 10, windowDimensions.height/2)
    }

    if (alive === 0) {
      let oldSnakes = []
      let averageFitness = 0
      for (let snake of snakes) {
        oldSnakes.push([snake, snake.getFitness()])
        averageFitness += snake.getFitness()
      }
      averageFitness /= snakes.length

      food = []
      console.log(
        `Generation ${generation} finished.
         Average Fitness: ${averageFitness}.
         Beginning generation ${generation + 1}`,
      )

      snakes = breed(oldSnakes)
      generation++
      roundTimer = 0
    }

    for (let i = 0; i < simulationSpeed; i++) {
      roundTimer++
      if (false && roundTimer % 360 === 0 && generation > 40) {
        food.push(new Food(
          (Math.random() * (windowDimensions.width - 50)) + 50,
          (Math.random() * (windowDimensions.height - 50)) + 50,
          snakes[0].width * 1.5,
          snakes[0].height * 1.5,
          'red'
        ))
          
      }
      //snakes[0].color = [255, 255, 255]
      //if (roundTimer % 10 === 0) {
        //console.log(snakes[0].temp)
      //}
      targets[0].target = snakes
      targets[1].target = food
      targets[2].target = walls
      for (let snake of snakes) {
        if (snake.getShouldUpdate()) {
          if (simulationSpeed < 5) {
            snake.draw(p5)
          } 
          snake.update(windowDimensions, targets)
        }
      }
      if (simulationSpeed < 5) {
        for (let morsel of food) {
          morsel.draw(p5)
        }
      }
    }
  }
}
