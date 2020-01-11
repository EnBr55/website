import { mutate } from './NeuralNet'
import { lineSnake, boxSnake, lineBox, colliding, removeElement } from './SimOperations'
import Snake from './Snake'
import Food from './Food'

export const SnakeSim = (p5) => {
  // WORLD VARIABLES
  let snakes = []
  let food = []
  let generation = 1

  // SIMULATION VARIABLES
  let simulationSpeed = 30
  let windowDimensions = {
    width: p5.windowWidth / 1.3,
    height: p5.windowHeight / 1.3,
  }
  let numSnakes = 15
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

  const snakeToFood = snake => {
    for (let segment of snake.segments) {
      food.push(new Food(
        segment.pos.x,
        segment.pos.y,
        segment.width,
        segment.height,
        snake.color
      ))
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
        if (other.getActive() && roundTimer/60 > 2) {
          caller.die()
          snakeToFood(caller)
        }
      },
    },
   {
     target: food,
     feelerCheck: lineBox,
     headCheck: colliding,
     response: -1,
     call: (caller, other) => {
       caller.feed(1)
       removeElement(food, other)
     }
   }
  ]

  // takes array of array of snake objects coupled with fitness
  const sortSnakes = (array) => {
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

    let numOldSnakes = Math.floor(numSnakes / 3)
    let numNewSnakes = numSnakes - numOldSnakes

    for (let i = 0; i < numOldSnakes; i++) {
      // push parent back in with no mutations to DNA
      newSnakes.push(
        new Snake(
          (Math.random() * windowDimensions.width) / 1.5,
          (Math.random() * windowDimensions.height) / 1.5,
          mutate(sortedSnakes[i][0].dna, 0)
        )
      )
    }

    for (let i = 0; i < numNewSnakes; i++) {
      // parent creates a child with mutations to dna
      newSnakes.push(
        new Snake(
          (Math.random() * windowDimensions.width) / 1.5,
          (Math.random() * windowDimensions.height) / 1.5,
          mutate(newSnakes[i % numOldSnakes].dna, Math.random() * 0.02)
        )
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

    alive = snakes.filter(t => t.getAlive()).length
    p5.noStroke()
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

      food = []
      console.log(
        `Generation ${generation} finished.
         Average Fitness: ${averageFitness}.
         Beginning generation ${generation + 1}`,
      )

      snakes = breed(oldSnakes)
      generation++
      roundTimer = 0
      if (generation > 10) { simulationSpeed = 1}
    }

    for (let i = 0; i < simulationSpeed; i++) {
      roundTimer++
      targets[0].target = snakes
      targets[1].target = food
      for (let snake of snakes) {
        if (snake.getShouldUpdate()) {
          if (simulationSpeed < 5) {
          snake.draw(p5)
          }
          snake.update(windowDimensions, targets)
        }
      }
      for (let morsel of food) {
        morsel.draw(p5)
      }
    }
  }
}
