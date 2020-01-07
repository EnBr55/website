import { NeuralNet, matrixConstructor, mutate, crossOver } from './NeuralNet'
import math from 'mathjs'

var simulation_data = []
export const SnakeSketch = (p5) => {
  let simulation_speed = 1

  let friend_list = []
  let frame_rate = 60
  let dir = 0
  let speed = 1

  let snake_list = []
  let generation = 0

  let show_eyes = 0

  let round_timer = 0

  let food_list = []

  let mutationRate = 0.1

  let generation_times = Array(10).fill(0)
  let generation_pointer = 0

  let round_start = new Date().getTime()

  let loaded = false

  window.p5 = p5

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth / 1.3, p5.windowHeight / 1.3)
    p5.frameRate(60)
  }

  p5.draw = () => {
    p5.background(51)
    p5.textSize(14)
    p5.fill('red')
    p5.text(
      'Generation: ' +
        generation +
        '. Snakes alive: ' +
        friend_list.length +
        '. Average time last ten generations: ' +
        generation_times.reduce((a, b) => a + b, 0) / 10 / 1000,
      0,
      20,
    )
    for (let g = 0; g < 1; g++) {
      round_timer += 1
      if (round_timer % 300 === 0 && generation > 7) {
        food_list.push(
          new Food(
            (p5.windowWidth / 1.7) * Math.random() + 40,
            (p5.windowHeight / 1.7) * Math.random() + 40,
            20,
            20,
          ),
        )
      }
      for (let friend of friend_list) {
        friend.update()
        if (true) {
          friend.draw()
        } else {
          p5.textSize(20)
          p5.text(
            'No rendering past 3x speed',
            p5.windowWidth / 4,
            p5.windowHeight / 4,
          )
        }
      }
      for (let food of food_list) {
        if (simulation_speed < 4) {
          food.draw()
        }
      }
    }

    if (friend_list.length === 0) {
      generation_times[generation_pointer % 10] =
        new Date().getTime() - round_start
      let averageFitness = 0
      for (let k = 0; k < snake_list.length; k++) {
        // if (k===0){console.log(snake_list[0])}
        snake_list[k][1] = snake_list[k][0].calculateFitness()
        averageFitness += snake_list[k][1]
      }
      averageFitness = averageFitness / snake_list.length

      console.log(
        'Generation finished. Average fitness: ' +
          averageFitness +
          '. Beginning generation: ' +
          (generation + 1),
      )

      if (averageFitness) {
        simulation_data.push(averageFitness)
      }

      generation += 1
      round_timer = 0
      // start a new generation with the dna of the previous pool
      generate(snake_list)
      round_start = new Date().getTime()
      generation_pointer += 1
    } else {

      // console.log(friend_list[0].feeler1_target)
      // console.log(friend_list[0].alive)
      // if (friend_list[0].feeler1_distance !== 2 || friend_list[0].feeler2_distance !== 2 || friend_list[0].feeler3_distance !== 2) {
      //   // console.table(friend_list[0].feeler1_distance, friend_list[0].feeler2_distance, friend_list[0].feeler3_distance)

      // }

      // console.table(friend_list[0].feeler1_distance, friend_list[0].feeler2_distance, friend_list[0].feeler3_distance)
    }
  }

  let colliding = (rect1, rect2) => {
    if (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    ) {
      return true
    } else {
      return false
    }
  }

  let lineLine = (line1, line2) => {
    let uA =
      ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
        (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
      ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
        (line2.x2 - line2.x1) * (line1.y2 - line1.y1))
    let uB =
      ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
        (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
      ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
        (line2.x2 - line2.x1) * (line1.y2 - line1.y1))
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      return true
    }
  }

  let lineBox = (line, box) => {
    let left = lineLine(line, {
      x1: box.x,
      y1: box.y,
      x2: box.x,
      y2: box.y + box.height,
    })
    let right = lineLine(line, {
      x1: box.x + box.width,
      y1: box.y,
      x2: box.x + box.width,
      y2: box.y + box.height,
    })
    let top = lineLine(line, {
      x1: box.x,
      y1: box.y,
      x2: box.x + box.width,
      y2: box.y,
    })
    let bottom = lineLine(line, {
      x1: box.x,
      y1: box.y + box.height,
      x2: box.x + box.width,
      y2: box.y + box.height,
    })
    if (left || right || top || bottom) {
      return true
    }
  }

  let getDistance = (obj1, obj2) => {
    return Math.sqrt((obj2.x - obj1.x) ** 2 + (obj2.y - obj1.y) ** 2)
  }

  let removeElement = (array, elem) => {
    var index = array.indexOf(elem)
    if (index > -1) {
      array.splice(index, 1)
    }
  }

  p5.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    show_eyes = props.show_eyes

    simulation_speed = props.sim_speed

    mutationRate = props.mutation_rate
  }

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth / 1.3, p5.windowHeight / 1.3)
  }

  let checkFeeler = (feeler, snake, type) => {
    if (type === 'snake-head') {
      return lineBox(feeler, snake)
    }
    if (type === 'snake-body') {
      return (
        lineBox(feeler, snake.tail1) ||
        lineBox(feeler, snake.tail1) ||
        lineBox(feeler, snake.tail1) ||
        lineBox(feeler, snake.tail4) ||
        lineBox(feeler, snake.tail5)
      )
    } else if (type === 'food') {
      return lineBox(feeler, snake)
    }
  }

  let checkAllFeelers = (self, other, response1, response2, type) => {
    if (checkFeeler(self.feeler1, other, type)) {
      self.color = [
        256 * self.dna[6][0][0],
        256 * self.dna[6][0][1],
        256 * self.dna[6][0][2],
        230,
      ]
      // self.hunger -= 0.1
      self.feeler1_distance =
        getDistance({ x: self.feeler1.x1, y: self.feeler1.y1 }, other, type) /
        self.feeler_length
      self.feeler11_target = response1
      self.feeler12_target = response2
    }
    if (checkFeeler(self.feeler2, other, type)) {
      self.color = [
        256 * self.dna[6][0][0],
        256 * self.dna[6][0][1],
        256 * self.dna[6][0][2],
        230,
      ]
      // self.hunger -= 0.1
      self.feeler2_distance =
        getDistance({ x: self.feeler2.x1, y: self.feeler2.y1 }, other, type) /
        self.feeler_length
      self.feeler21_target = response1
      self.feeler22_target = response2
    }
    if (checkFeeler(self.feeler3, other, type)) {
      self.color = [
        256 * self.dna[6][0][0],
        256 * self.dna[6][0][1],
        256 * self.dna[6][0][2],
        230,
      ]
      // self.hunger -= 0.1
      self.feeler3_distance =
        getDistance({ x: self.feeler3.x1, y: self.feeler3.y1 }, other, type) /
        self.feeler_length
      self.feeler31_target = response1
      self.feeler32_target = response2
    }
    if (checkFeeler(self.feeler4, other, type)) {
      self.color = [
        256 * self.dna[6][0][0],
        256 * self.dna[6][0][1],
        256 * self.dna[6][0][2],
        230,
      ]
      // self.hunger -= 0.1
      self.feeler4_distance =
        getDistance({ x: self.feeler4.x1, y: self.feeler4.y1 }, other, type) /
        self.feeler_length
      self.feeler41_target = response1
      self.feeler42_target = response2
    }
    if (checkFeeler(self.feeler5, other, type)) {
      self.color = [
        256 * self.dna[6][0][0],
        256 * self.dna[6][0][1],
        256 * self.dna[6][0][2],
        230,
      ]
      // self.hunger -= 0.1
      self.feeler5_distance =
        getDistance({ x: self.feeler5.x1, y: self.feeler5.y1 }, other, type) /
        self.feeler_length
      self.feeler51_target = response1
      self.feeler52_target = response2
    }
  }

  // takes in array of arrays, and sorts in increasing order of their second element
  let sortSnakes = (array) => {
    //console.log(array)
    function comparator(a, b) {
      if (a[1] < b[1]) return -1
      if (a[1] > b[1]) return 1
      return 0
    }
    let sorted = array
    sorted = sorted.sort(comparator)
    sorted = sorted.reverse()
    return sorted
  }

  let sliceArrays = (array1, array2) => {
    let len1 = Math.ceil(array1.length / 2)
    let len2 = Math.ceil(array2.length / 2)
    let leftside = array1.slice(0, len1)
    let rightside = array2.slice(len2, array2.length)
    return leftside.concat(rightside)
  }

  let randomiseArrays = (array1, array2) => {
    let len = array1.length
    let arrays = [array1, array2]
    let newArray = []
    for (let i = 0; i < len; i++) {
      newArray[i] = arrays[Math.round(Math.random())][i]
    }
    return newArray
  }

  let generate = (pool) => {
    snake_list = []
    friend_list = []

    if (generation === 1) {
      for (let i = 0; i < 20; i++) {
        let snek = new SnakeFriend(
          (p5.windowWidth / 1.7) * Math.random() + 40,
          (p5.windowHeight / 1.7) * Math.random() + 40,
          20,
          20,
          1,
          matrixConstructor(15, 16, 16, 2, 4),
        )
        friend_list.push(snek)
        snake_list.push([snek, 0])
      }
    } else {
      let sortedSnakes = sortSnakes(pool)
      // let parent_pool = []
      let dna = []

      // console.log(sortedSnakes)
      // console.log(sortedSnakes)
      // console.log(friend_list)
      // console.log(snake_list)
      for (let i = 0; i < sortedSnakes.length / 2; i++) {
        // push top ten parents back in and mutate their dna by 0
        let snek = new SnakeFriend(
          (p5.windowWidth / 1.7) * Math.random() + 40,
          (p5.windowHeight / 1.7) * Math.random() + 40,
          20,
          20,
          1,
          mutate(sortedSnakes[i][0].dna, 0),
        )
        // push good parents back in
        friend_list.push(snek)
        snake_list.push([snek, 0])

        // each parents has a child
        // let snekChild = new SnakeFriend(p5.windowWidth / 1.7 * Math.random() + 40, p5.windowHeight / 1.7 * Math.random() + 40, 20, 20, 1, mutate(sortedSnakes[i][0].dna, (mutationRate||0.1) ))

        // Crossover DNA of adjacent snakes in the ranked pool.

        let snekChild = new SnakeFriend(
          (p5.windowWidth / 1.7) * Math.random() + 40,
          (p5.windowHeight / 1.7) * Math.random() + 40,
          20,
          20,
          1,
          crossOver(
            sortedSnakes[i][0],
            sortedSnakes[i + 1][0],
            mutationRate || 0.1,
          ),
        )
        // console.log(snekChild)
        friend_list.push(snekChild)
        snake_list.push([snekChild, 0])
      }

      if (generation > 2) {
        food_list = []
        for (let k = 0; k < 3; k++) {
          food_list.push(
            new Food(
              (p5.windowWidth / 1.7) * Math.random() + 40,
              (p5.windowHeight / 1.7) * Math.random() + 40,
              20,
              20,
            ),
          )
        }
      }
    }

    // else {
    //   let sortedSnakes = sortSnakes(pool)
    //   let parent_pool = []
    //   for (let i=0; i < sortedSnakes.length; i++){
    //     for (let k=0; k < i*3; k++) {
    //       parent_pool.push(sortedSnakes[i])
    //     }
    //   }

    //   console.log(parent_pool)
    //   snake_list = []
    //   for (let i = 0; i < 20; i++) {

    //     let parent1 = parent_pool[Math.floor(Math.random()*parent_pool.length)][0].dna
    //     let parent2 = parent_pool[Math.floor(Math.random()*parent_pool.length)][0].dna

    //     let dna = []
    //     dna[0] = randomiseArrays(parent1[0], parent2[0])
    //     dna[1] = randomiseArrays(parent1[1], parent2[1])
    //     dna[2] = randomiseArrays(parent1[2], parent2[2])
    //     dna[3] = randomiseArrays(parent1[3], parent2[3])
    //     dna[4] = randomiseArrays(parent1[4], parent2[4])
    //     dna[5] = randomiseArrays(parent1[5], parent2[5])

    //     let snek = new SnakeFriend(p5.windowWidth/1.7 * Math.random() + 40, p5.windowHeight/1.7 * Math.random() + 40, 20, 20, 1, dna)
    //     friend_list.push(snek)
    //     snake_list.push([snek, 0])
    //   }

    // }
  }

  ///////////////////////////////////////// SNAKE STUFF

  class SnakeFriend {
    constructor(x, y, height, width, decision_interval, given_dna) {
      this.dna = given_dna
      this.alive = true

      this.size = Math.max(0.6, 0.6 + this.dna[6][0][3])
      this.h = height
      this.w = width
      this.height = this.h * this.size
      this.width = this.w * this.size
      this.x = x
      this.y = y
      this.x_vel = 0
      this.y_vel = 0
      this.internal_timer = 0
      this.decision_interval = decision_interval
      this.history = Array(frame_rate).fill({ x: this.x, y: this.y })
      // Direction of the snake --> -1 for left, 1 for right
      this.direction = Math.round(2.4 * Math.random() - 1.2)
      // Angle of the snake
      this.facing = Math.random() * 2 - 1
      this.speed = 1.5
      // Whether or not the snake is moving --> 0 = not moving, 1 = moving
      this.moving = 1
      this.hunger = 0

      this.color = [
        255 * this.dna[6][0][0] + 50,
        255 * this.dna[6][0][1] + 50,
        255 * this.dna[6][0][2] + 50,
        160,
      ]

      // set when the snake dies
      this.timeOfDeath = 0

      // starts when the snake dies
      this.deathtimer = 0

      // keep track of how much turning the snake has done
      this.delta_spin = 0

      this.examined = false

      // SNAKE BRAIN

      this.brain = new NeuralNet(this.dna)

      // initialise tail
      this.tail1 = {
        x: this.history[(round_timer + 10) % 60].x,
        y: this.history[(round_timer + 10) % 60].y,
        width: (this.width / 2.5) * this.size,
        height: (this.height / 2.5) * this.size,
      }
      this.tail2 = {
        x: this.history[(round_timer + 20) % 60].x,
        y: this.history[(round_timer + 20) % 60].y,
        width: (this.width / 2.3) * this.size,
        height: (this.height / 2.3) * this.size,
      }
      this.tail3 = {
        x: this.history[(round_timer + 30) % 60].x,
        y: this.history[(round_timer + 30) % 60].y,
        width: (this.width / 2.1) * this.size,
        height: (this.height / 2.1) * this.size,
      }
      this.tail4 = {
        x: this.history[(round_timer + 40) % 60].x,
        y: this.history[(round_timer + 40) % 60].y,
        width: (this.width / 1.9) * this.size,
        height: (this.height / 1.9) * this.size,
      }
      this.tail5 = {
        x: this.history[(round_timer + 50) % 60].x,
        y: this.history[(round_timer + 50) % 60].y,
        width: (this.width / 1.7) * this.size,
        height: (this.height / 1.7) * this.size,
      }
      // initialise feelers

      this.feeler_length = 220

      this.feeler1 = {
        x1: this.x + this.width / 2,
        x2:
          this.x +
          this.width / 2 +
          this.feeler_length * Math.cos(this.facing - Math.PI / 4),
        y1: this.y + this.height / 2,
        y2:
          this.y +
          this.height / 2 +
          this.feeler_length * Math.sin(this.facing - Math.PI / 4),
      }
      this.feeler2 = {
        x1: this.x + this.width / 2,
        x2:
          this.x + this.width / 2 + this.feeler_length * Math.cos(this.facing),
        y1: this.y + this.height / 2,
        y2:
          this.y + this.height / 2 + this.feeler_length * Math.sin(this.facing),
      }
      this.feeler3 = {
        x1: this.x + this.width / 2,
        x2:
          this.x +
          this.width / 2 +
          this.feeler_length * Math.cos(this.facing + Math.PI / 4),
        y1: this.y + this.height / 2,
        y2:
          this.y +
          this.height / 2 +
          this.feeler_length * Math.sin(this.facing + Math.PI / 4),
      }
      this.feeler4 = {
        x1: this.x + this.width / 2,
        x2:
          this.x +
          this.width / 2 +
          this.feeler_length * Math.cos(this.facing - Math.PI / 2),
        y1: this.y + this.height / 2,
        y2:
          this.y +
          this.height / 2 +
          this.feeler_length * Math.sin(this.facing - Math.PI / 2),
      }
      this.feeler5 = {
        x1: this.x + this.width / 2,
        x2:
          this.x +
          this.width / 2 +
          this.feeler_length * Math.cos(this.facing + Math.PI / 2),
        y1: this.y + this.height / 2,
        y2:
          this.y +
          this.height / 2 +
          this.feeler_length * Math.sin(this.facing + Math.PI / 2),
      }

      this.feelers = [
        this.feeler1,
        this.feeler2,
        this.feeler3,
        this.feeler4,
        this.feeler5,
      ]

      this.feeler1_distance = 1
      this.feeler2_distance = 1
      this.feeler3_distance = 1
      this.feeler4_distance = 1
      this.feeler5_distance = 1

      this.feeler11_target = 0
      this.feeler12_target = 0
      this.feeler21_target = 0
      this.feeler22_target = 0
      this.feeler31_target = 0
      this.feeler32_target = 0
      this.feeler41_target = 0
      this.feeler42_target = 0
      this.feeler51_target = 0
      this.feeler52_target = 0
    }
    update() {
      this.height = this.h * this.size
      this.width = this.w * this.size

      // this.color = [256*0.03, 256*0.57 + this.hunger*3, 256*0.82, 200]

      let coolOffRate = 0.05
      this.feeler1_distance = Math.min(1, this.feeler1_distance + coolOffRate)
      this.feeler2_distance = Math.min(1, this.feeler2_distance + coolOffRate)
      this.feeler3_distance = Math.min(1, this.feeler3_distance + coolOffRate)
      this.feeler4_distance = Math.min(1, this.feeler4_distance + coolOffRate)
      this.feeler5_distance = Math.min(1, this.feeler5_distance + coolOffRate)

      this.feeler1_distance = 1
      this.feeler2_distance = 1
      this.feeler3_distance = 1
      this.feeler4_distance = 1
      this.feeler5_distance = 1

      this.feeler11_target = 0
      this.feeler12_target = 0
      this.feeler21_target = 0
      this.feeler22_target = 0
      this.feeler31_target = 0
      this.feeler32_target = 0
      this.feeler41_target = 0
      this.feeler42_target = 0
      this.feeler51_target = 0
      this.feeler52_target = 0

      this.color = [
        255 * this.dna[6][0][0] + 50,
        255 * this.dna[6][0][1] + 50,
        255 * this.dna[6][0][2] + 50,
        160,
      ]

      // Interactions with other snakes
      for (let snake of friend_list) {
        if (snake.alive || snake.deathtimer < 8) {
          if (snake !== this && this.alive) {
            if (
              (colliding(this, snake) ||
                colliding(this, snake.tail1) ||
                colliding(this, snake.tail2) ||
                colliding(this, snake.tail3) ||
                colliding(this, snake.tail4) ||
                colliding(this, snake.tail5)) &&
              round_timer > 1 * 60
            ) {
              this.timeOfDeath = round_timer
              if (colliding(this, snake) && this.size > snake.size) {
                this.hunger -= 3
                this.size += 0.05
              } else {
                this.alive = false
              }
            }

            checkAllFeelers(
              this,
              snake,
              snake.size - this.size < 0 ? -1 : 1,
              3 * (snake.size - this.size < 0) ? -1 : 1,
              'snake-head',
            )
            checkAllFeelers(this, snake, 1, 1, 'snake-body')
          }
        }
      }

      for (let food of food_list) {
        if (colliding(this, food)) {
          this.hunger -= 5
          this.size += 0.05
          food.die()
        }

        checkAllFeelers(this, food, -1, -1, 'food')
      }

      // Update internal timer and brain
      // this.internal_timer += 1
      this.outputs = this.brain.feedforward([
        [this.feeler1_distance],
        [this.feeler2_distance],
        [this.feeler3_distance],
        [this.feeler4_distance],
        [this.feeler5_distance],
        [this.feeler11_target],
        [this.feeler12_target],
        [this.feeler21_target],
        [this.feeler22_target],
        [this.feeler31_target],
        [this.feeler32_target],
        [this.feeler41_target],
        [this.feeler42_target],
        [this.feeler51_target],
        [this.feeler52_target],
      ])

      if (this.alive) {
        this.internal_timer += 1
        if (this.examined) {
          this.facing += dir * 0.07
          this.speed = speed
        } else if (
          this.feeler1_distance +
            this.feeler2_distance +
            this.feeler3_distance +
            this.feeler4_distance +
            this.feeler5_distance <
          5
        ) {
          this.facing += 0.07 * this.outputs[0]

          this.speed = 3 + this.outputs[1] * 3

          this.delta_spin += Math.abs(0.2 * this.outputs[0])
        } else {
          this.facing += 0.25 * Math.random() - 0.25 / 2
          // this.speed = 3 + Math.random()
        }

        // more spinny = more hungry
        // this.hunger += 2 * Math.abs(this.outputs[0])
      }

      /////////////////////////////////////////////

      // the history of the particle is updated every frame

      this.history[this.internal_timer % frame_rate] = { x: this.x, y: this.y }

      // Update dimensions
      // Update Tail

      this.tail1 = {
        x: this.history[(this.internal_timer + 10) % frame_rate].x,
        y: this.history[(this.internal_timer + 10) % frame_rate].y,
        width: this.width / 2.5,
        height: this.height / 2.5,
      }
      this.tail2 = {
        x: this.history[(this.internal_timer + 20) % frame_rate].x,
        y: this.history[(this.internal_timer + 20) % frame_rate].y,
        width: this.width / 2.3,
        height: this.height / 2.3,
      }
      this.tail3 = {
        x: this.history[(this.internal_timer + 30) % frame_rate].x,
        y: this.history[(this.internal_timer + 30) % frame_rate].y,
        width: this.width / 2.1,
        height: this.height / 2.1,
      }
      this.tail4 = {
        x: this.history[(this.internal_timer + 40) % frame_rate].x,
        y: this.history[(this.internal_timer + 40) % frame_rate].y,
        width: this.width / 1.9,
        height: this.height / 1.9,
      }
      this.tail5 = {
        x: this.history[(this.internal_timer + 50) % frame_rate].x,
        y: this.history[(this.internal_timer + 50) % frame_rate].y,
        width: this.width / 1.7,
        height: this.height / 1.7,
      }

      // Set x and y velocity based on direction
      this.x_vel = this.speed * Math.cos(this.facing)
      this.y_vel = this.speed * Math.sin(this.facing)

      // starve the living
      // 1 hunger per second.
      this.hunger += 1 / frame_rate
      this.hunger += this.size ** 1.7 / frame_rate
      if (this.speed < 0.6) {
        this.hunger += 1.5 / frame_rate
      }
      // this.hunger += 1/this.speed * 1/frame_rate

      // more speed = less hungry

      // this.hunger += (4/math.abs(this.x_vel)) /60
      // this.hunger += (4/math.abs(this.y_vel)) /60

      // small amount of noise in all movements for realism

      // Reptile-based random decision making every 'decision interval'
      // if ((this.internal_timer/60)%this.decision_interval === 0){

      // this.x_vel += (this.x_vel*Math.random()-this.x_vel/2)
      // this.y_vel += (this.y_vel*Math.random()-this.y_vel/2)

      // this.y_vel += 0.6*Math.random() - 0.3
      // this.x_vel += 0.6*Math.random() - 0.3
      // }

      // WALL BOUNDARY CHECKING
      if (this.x < 30) {
        this.x_vel = 0.1
        this.facing += 0.1
      }

      if (this.x > p5.windowWidth / 1.3 - 30) {
        this.x_vel = -0.1
        this.facing += 0.1
      }

      if (this.y < 30) {
        this.y_vel = 0.1
        this.facing += 0.1
      }

      if (this.y > p5.windowHeight / 1.3 - 30) {
        this.y_vel = -0.1
        this.facing += 0.1
      }

      //  update position based on velocity
      this.x += this.x_vel * this.moving
      this.y += this.y_vel * this.moving

      // cull the meek
      if (this.hunger > 30) {
        this.alive = false
      }
      // harvest the dead
      if (!this.alive) {
        this.color = [256 * 0.803, 256 * 0.03, 256 * 0.04, 80]
        this.speed = 0
        this.deathtimer += 1
      }
      if (this.deathtimer > 60) {
        removeElement(friend_list, this)
      }

      // birth the new

      // if (this.internal_timer/60%30 === 0){
      //   friend_list.push(new SnakeFriend(p5.windowWidth/1.7 * Math.random() + 40, p5.windowHeight/1.7 * Math.random() + 40, 20, 20, 1, matrixConstructor(3, 16, 4, 1)))
      // }
      this.feeler1 = {
        x1: this.x + this.width / 2,
        x2:
          this.x +
          this.width / 2 +
          this.feeler_length * Math.cos(this.facing - Math.PI / 4),
        y1: this.y + this.height / 2,
        y2:
          this.y +
          this.height / 2 +
          this.feeler_length * Math.sin(this.facing - Math.PI / 4),
      }
      this.feeler2 = {
        x1: this.x + this.width / 2,
        x2:
          this.x + this.width / 2 + this.feeler_length * Math.cos(this.facing),
        y1: this.y + this.height / 2,
        y2:
          this.y + this.height / 2 + this.feeler_length * Math.sin(this.facing),
      }
      this.feeler3 = {
        x1: this.x + this.width / 2,
        x2:
          this.x +
          this.width / 2 +
          this.feeler_length * Math.cos(this.facing + Math.PI / 4),
        y1: this.y + this.height / 2,
        y2:
          this.y +
          this.height / 2 +
          this.feeler_length * Math.sin(this.facing + Math.PI / 4),
      }
      this.feeler4 = {
        x1: this.x + this.width / 2,
        x2:
          this.x +
          this.width / 2 +
          this.feeler_length * Math.cos(this.facing - Math.PI / 2),
        y1: this.y + this.height / 2,
        y2:
          this.y +
          this.height / 2 +
          this.feeler_length * Math.sin(this.facing - Math.PI / 2),
      }
      this.feeler5 = {
        x1: this.x + this.width / 2,
        x2:
          this.x +
          this.width / 2 +
          this.feeler_length * Math.cos(this.facing + Math.PI / 2),
        y1: this.y + this.height / 2,
        y2:
          this.y +
          this.height / 2 +
          this.feeler_length * Math.sin(this.facing + Math.PI / 2),
      }
    }

    draw() {
      // Head
      this.tongue = {
        x1: this.x + this.width / 2,
        x2: this.x + this.width / 2 + this.width * Math.cos(this.facing),
        y1: this.y + this.height / 2,
        y2: this.y + this.height / 2 + this.width * Math.sin(this.facing),
      }
      p5.stroke('red')
      p5.line(
        this.tongue.x1,
        this.tongue.y1,
        this.tongue.x2 + Math.SQRT2 * this.size,
        this.tongue.y2 + 1 * this.size,
      )

      p5.fill(this.collidingColor || this.color)
      p5.noStroke()
      // Body
      if (this.examined) {
        p5.fill(this.collidingColor || 'yellow')
      }
      p5.rect(this.x, this.y, this.width, this.height)
      // Tail

      p5.rect(this.tail1.x, this.tail1.y, this.tail1.width, this.tail1.height)
      p5.rect(this.tail2.x, this.tail2.y, this.tail2.width, this.tail2.height)
      p5.rect(this.tail3.x, this.tail3.y, this.tail3.width, this.tail3.height)
      p5.rect(this.tail4.x, this.tail4.y, this.tail4.width, this.tail4.height)
      p5.rect(this.tail5.x, this.tail5.y, this.tail5.width, this.tail5.height)

      // 'Feelers'
      if (show_eyes) {
        p5.stroke(this.color)
        p5.line(
          this.feeler1.x1,
          this.feeler1.y1,
          this.feeler1.x2,
          this.feeler1.y2,
        )
        p5.line(
          this.feeler2.x1,
          this.feeler2.y1,
          this.feeler2.x2,
          this.feeler2.y2,
        )
        p5.line(
          this.feeler3.x1,
          this.feeler3.y1,
          this.feeler3.x2,
          this.feeler3.y2,
        )
        p5.line(
          this.feeler4.x1,
          this.feeler4.y1,
          this.feeler4.x2,
          this.feeler4.y2,
        )
        p5.line(
          this.feeler5.x1,
          this.feeler5.y1,
          this.feeler5.x2,
          this.feeler5.y2,
        )
      }
    }

    calculateFitness() {
      return this.internal_timer
      // console.log(this.delta_spin)
      // return this.delta_spin
    }
  }

  class Food {
    constructor(x, y, width, height) {
      this.y = y
      this.x = x
      this.width = width
      this.height = height
    }

    die() {
      removeElement(food_list, this)
    }

    draw() {
      p5.fill('red')
      p5.rect(this.x, this.y, this.width, this.height)
      p5.fill('green')
      p5.rect(this.x, this.y, this.width / 1.4, this.height / 1.4)
    }
  }

  //////////////////////////////////////// SNAKE STUFF ///////////////////////////////////

  //////////////////////////   I would love to move this to its own file but react and p5 hate me
  //////////////////        and i haven't figured out a good way to do it yet

  // MATRIX CONSTRUCTOR:
  // the first parameter - input nodes - must be the same length as the number of expected inputs.
  // the second and third parameters are the number of nodes in the hidden layers
  // the fourth parameter is the number of output nodes
  // the last parameter (optional) is the number of 'genes' --> these dont get fed forwards, but can but useful for specific things
  //

  //let x = new NeuralNet(3, 3, 3, 3)
  //console.log(x)

  let x = new NeuralNet(matrixConstructor(4, 16, 16, 2, 0))
  // console.log(x.feedforward([[0], [0], [0], [0]]))
  // console.log(x.feedforward([[1], [0.5], [2], [0]]))
  // console.log(x.feedforward([[1], [0.5], [2], [0]]))
}
