import { NeuralNet, matrixConstructor, mutate, crossOver } from './NeuralNet'

export default class Snake {
  constructor(x, y, dna) {

    this.alive = true
    this.hunger = { max: 30, min: 0, current: 0 }

    this.width = 50
    this.height = 50

    this.pos = { x: x, y: y }
    this.vel = { x: 0, y: 0 }
    this.speed = 1
    this.dir = Math.random() * 2 * Math.PI - Math.PI

    this.history = Array(60).fill({ x: this.pos.x, y: this.pos.y })
    this.time = 0
    this.clock = 0
    this.deathTimer = 0
    this.shouldUpdate = true

    this.numFeelers = 5
    this.feelerLength = 300
    this.feelers = []
    for (let i = 1; i < this.numFeelers + 1; i++) {
      // Divide a semicircle in n+1 equal section with n lines (feelers)
      // Assume angle of 0 goes through the centre of the semicircle such that -PI/2 is the start
      let angle = (-Math.PI / 2) + (i * Math.PI / (this.numFeelers + 1))
      this.feelers.push({
        x1: this.pos.x + this.width / 2,
        x2: this.pos.x + this.width / 2 + this.feelerLength * Math.cos(this.dir - angle),
        y1: this.pos.y + this.height / 2,
        y2: this.pos.y + this.height / 2 + this.feelerLength * Math.sin(this.dir - angle),
        distance: 1,
        value: 0
      })
    }

    this.segments = [
      { x: this.pos.x, y: this.pos.y, width: this.width, height: this.height },
    ]
    this.numTailSegments = 4
    // Number of divisions of the framerate to account for
    this.tailSegmentOffset = Math.floor(60 / (this.numTailSegments + 1))

    for (let i = 1; i < this.numTailSegments + 1; i++) {
      this.segments.push({
        x: this.history[(this.clock + this.tailSegmentOffset * i + 60) % 60].x,
        y: this.history[(this.clock + this.tailSegmentOffset * i + 60) % 60].y,
        width: this.width - this.width * 0.1 * i,
        height: this.height - this.width * 0.1 * i,
      })
    }

    this.dna = dna
    if (!this.dna) {
      this.dna = matrixConstructor(this.numFeelers * 2 + 2, 16, 16, 2, 4)
    }
    this.color = [0, 200, 50, 100]
    this.brain = new NeuralNet(this.dna)
  }

  die() {
    this.alive = false
  }

  updateFeelers() {
    for (let i = 1; i < this.numFeelers + 1; i++) {
      // Divide a semicircle in n+1 equal section with n lines (feelers)
      // Assume angle of 0 goes through the centre of the semicircle such that -PI/2 is the start
      let angle = (-Math.PI / 2) + (i * Math.PI / (this.numFeelers + 1))
      this.feelers[i-1] = {
        ...this.feelers[i-1],
        x1: this.pos.x + this.width / 2,
        x2: this.pos.x + this.width / 2 + this.feelerLength * Math.cos(this.dir - angle),
        y1: this.pos.y + this.height / 2,
        y2: this.pos.y + this.height / 2 + this.feelerLength * Math.sin(this.dir - angle)
      }
    }
  }

  toFeelerDistance(obj1, obj2) {
    let dist = Math.sqrt((obj2.x - obj1.x) ** 2 + (obj2.y - obj1.y) ** 2)
    return dist >= this.feelerLength ? 1 : dist / this.feelerLength
  }
  
  checkFeelers(group, check, response) {
    this.color[3] = 80
    for (let feeler of this.feelers) {
      // initial values (if not colliding)
      feeler.value = 0
      feeler.distance = 1

      for (let body of group) {
        if (body !== this) {
          if (check(feeler, body)) {
            feeler.value = response
            feeler.distance = this.toFeelerDistance(feeler.x1, body.pos.x)
            this.color[3] = 200
          }
        }
      }
    }
  }
  
  getFitness() {
    return this.clock
  }

  update(windowDimensions, world) {
    if (this.alive) {
      this.clock++

      // Update position
      this.updateFeelers()

      let inputs = []
      for (let feeler of this.feelers) { 
        inputs.push([feeler.distance])
        inputs.push([feeler.value])
      }
      inputs.push([this.hunger.current])
      inputs.push([this.hunger.max])
      let outputs = this.brain.feedforward(inputs)
      
      if (outputs[0]) { this.dir += outputs[0] * 0.12 } 
      if (outputs[1]) { this.speed = 2 + outputs[1] * 2 }

      this.vel.x = this.speed * Math.cos(this.dir)
      this.vel.y = this.speed * Math.sin(this.dir)

      // Check walls
      if (this.pos.x <= 0) {
        this.vel.x = 0.1
      }
      if (this.pos.x >= windowDimensions.width - this.width) {
        this.vel.x = -0.1
      }
      if (this.pos.y <= 0) {
        this.vel.y = 0.1
      }
      if (this.pos.y >= windowDimensions.height - this.height) {
        this.vel.y = -0.1
      }

      this.pos.x += this.vel.x
      this.pos.y += this.vel.y

      // Write position to history and update segments based on position
      this.history[this.clock % 60] = { x: this.pos.x, y: this.pos.y }
      this.segments[0].x = this.pos.x
      this.segments[0].y = this.pos.y
      for (let i = 1; i < this.numTailSegments + 1; i++) {
        this.segments[i].x = this.history[
          (this.clock - this.tailSegmentOffset * i + 60) % 60
        ].x
        this.segments[i].y = this.history[
          (this.clock - this.tailSegmentOffset * i + 60) % 60
        ].y
      }

      // Update hunger
      if (this.clock % 60 === 0) { this.hunger.current++ }
      if (this.hunger.current > this.hunger.max) {
        this.alive = false
      }

      // Collisions
      for (let obj of world) {
        // Update feelers
        this.checkFeelers(obj.target, obj.feelerCheck, obj.response)
        // Collisions involving head
        for (let body of obj.target) {
          if (body !== this && obj.headCheck(this.segments[0], body)) { 
            obj.call(this, body)
          }
        }
      }
    } else {
      this.color = [200, 0, 0, 50]
      this.deathTimer++
      if (this.deathTimer / 60 > 3) {
        this.shouldUpdate = false
      }
    }
  }

  getShouldUpdate() {
    return this.shouldUpdate
  }

  getAlive() {
    return this.alive
  }

  draw(p5) {
    for (let segment of this.segments) {
      p5.fill(this.color)
      p5.noStroke()
      p5.rect(segment.x, segment.y, segment.width, segment.height)
    }
    p5.stroke('red')
    p5.line(
      this.pos.x + this.width / 2,
      this.pos.y + this.height / 2,
      this.pos.x + this.width / 2 + this.width * Math.cos(this.dir),
      this.pos.y + this.height / 2 + this.height * Math.sin(this.dir),
    )
    p5.stroke(this.color)
    for (let feeler of this.feelers) {
      p5.line(feeler.x1, feeler.y1, feeler.x2, feeler.y2)
    }
  }
}
