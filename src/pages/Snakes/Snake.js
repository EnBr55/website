import { NeuralNet, matrixConstructor } from './NeuralNet'

export default class Snake {
  constructor(x, y, dna) {
    this.alive = true
    this.active = true
    this.hunger = { max: 40, min: 0, current: 0 }

    this.width = 15
    this.height = 15

    this.pos = { x: x, y: y }
    this.vel = { x: 0, y: 0 }
    this.speed = 1
    this.dir = Math.random() * 2 * Math.PI - Math.PI

    this.history = Array(60).fill({ x: this.pos.x, y: this.pos.y })
    this.time = 0
    this.clock = 0
    this.deathTimer = 0
    this.fitness = 0

    this.shouldUpdate = true
    this.showEyes = false

    this.numFeelers = 7
    this.feelerLength = 400
    this.feelers = []
    for (let i = 1; i < this.numFeelers + 1; i++) {
      // Divide a semicircle in n+1 equal section with n lines (feelers)
      // Assume angle of 0 goes through the centre of the semicircle such that -PI/2 is the start
      let angle = -Math.PI / 2 + (i * Math.PI) / (this.numFeelers + 1)
      this.feelers.push({
        x1: this.pos.x + this.width / 2,
        x2:
          this.pos.x +
          this.width / 2 +
          this.feelerLength * Math.cos(this.dir - angle),
        y1: this.pos.y + this.height / 2,
        y2:
          this.pos.y +
          this.height / 2 +
          this.feelerLength * Math.sin(this.dir - angle),
        distance: 1,
        value: 0.5,
      })
    }

    this.segments = [
      { pos: { x: this.pos.x, y: this.pos.y }, width: this.width, height: this.height },
    ]
    this.numTailSegments = 4
    // Number of divisions of the framerate to account for
    this.tailSegmentOffset = Math.floor(60 / (this.numTailSegments + 1))

    for (let i = 1; i < this.numTailSegments + 1; i++) {
      this.segments.push({
        pos: {
        x: this.history[(this.clock + this.tailSegmentOffset * i + 60) % 60].x,
        y: this.history[(this.clock + this.tailSegmentOffset * i + 60) % 60].y,
        },
        width: this.width - this.width * 0.1 * i,
        height: this.height - this.width * 0.1 * i,
      })
    }

    this.dna = dna
    if (!this.dna) {
      // [input nodes, hidden layer 1, hidden layer 2, output nodes, genes]
      this.dna = matrixConstructor(this.numFeelers * 2 + 2, 64, 64, 2, 3)
    }
    this.genes = this.dna[6][0]
    this.color = [
      200 * this.genes[0] + 50,
      200 * this.genes[1] + 50,
      200 * this.genes[2] + 50,
      20,
    ]
    this.brain = new NeuralNet(this.dna)
  }

  die() {
    this.alive = false
  }

  feed(amount) {
    this.hunger.current = Math.max(this.hunger.min, this.hunger.current - amount)
    this.fitness += 3 * amount * 60
  }

  updateFeelers() {
    for (let i = 1; i < this.numFeelers + 1; i++) {
      // Divide a semicircle in n+1 equal section with n lines (feelers)
      // Assume angle of 0 goes through the centre of the semicircle such that -PI/2 is the start
      let angle = -Math.PI / 2 + (i * Math.PI) / (this.numFeelers + 1)
      this.feelers[i - 1] = {
        ...this.feelers[i - 1],
        x1: this.pos.x + this.width / 2,
        x2:
          this.pos.x +
          this.width / 2 +
          this.feelerLength * Math.cos(this.dir - angle),
        y1: this.pos.y + this.height / 2,
        y2:
          this.pos.y +
          this.height / 2 +
          this.feelerLength * Math.sin(this.dir - angle),
      }
    }
  }

  toFeelerDistance(feeler, obj) {
    let dist = Math.sqrt((obj.pos.x - feeler.x1) ** 2 + (obj.pos.y - feeler.y1) ** 2)
    return dist / this.feelerLength
  }

  checkFeelers(group, check, response) {
    for (let feeler of this.feelers) {
      for (let body of group) {
        if (body !== this) {
          let distance = check(feeler, body)
          if (distance) {
            if (distance / this.feelerLength < 1) {
              feeler.distance = distance / (this.height + this.feelerLength)
              feeler.value = response
            }
            this.color[3] = 200
          }
        }
      }
    }
  }

  getFitness() {
    return this.clock
  }

  getDna() {
    return this.dna
  }

  update(windowDimensions, world) {

    if (this.alive) {
      if (this.active) {
        this.clock++
      }

      // wiggle
      this.dir += Math.random() * 0.125 - 0.1125

      // Update position
      this.updateFeelers()

      let inputs = []
      for (let feeler of this.feelers) {
        inputs.push([feeler.distance])
        inputs.push([feeler.value])
      }
      inputs.push([this.hunger.current / this.hunger.max])
      inputs.push([this.hunger.current / this.hunger.max])
      let outputs = this.brain.feedforward(inputs)

      if (outputs[1]) {
        this.speed = 2 + outputs[1] * 1
      }

      if (this.feelers.filter(t => t.distance === 1).length === this.numFeelers) {
        this.dir += Math.random() * 0.25 - 0.125
      } 
      else if (outputs[0]) {
        this.dir += outputs[0] * 0.09
        this.hunger.current += Math.abs(outputs[0]**3) * 0.1
      }

      this.vel.x = this.speed * Math.cos(this.dir)
      this.vel.y = this.speed * Math.sin(this.dir)

      this.pos.x += this.vel.x
      this.pos.y += this.vel.y

      // Write position to history and update segments based on position
      this.history[this.clock % 60] = { x: this.pos.x, y: this.pos.y }
      this.segments[0].pos.x = this.pos.x
      this.segments[0].pos.y = this.pos.y
      for (let i = 1; i < this.numTailSegments + 1; i++) {
        this.segments[i].pos.x = this.history[
          (this.clock - this.tailSegmentOffset * i + 60) % 60
        ].x
        this.segments[i].pos.y = this.history[
          (this.clock - this.tailSegmentOffset * i + 60) % 60
        ].y
      }

      // Update hunger
      if (this.clock % 60 === 0) {
        this.hunger.current++
      }
      if (this.hunger.current > this.hunger.max) {
        this.die()
      }

      // Collisions

      // initial values (if not colliding)
      this.color[3] = 80
      for (let feeler of this.feelers) {
        feeler.distance = 1
        feeler.value = 0.5
      }

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
      if (this.deathTimer > 30) {
        this.active = false
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

  getActive() {
    return this.active
  }

  draw(p5) {
    for (let segment of this.segments) {
      let hungerModifier = 1 - (this.hunger.current/this.hunger.max)
      p5.fill([this.color[0], this.color[1], this.color[2], this.color[3]*hungerModifier**2])
      p5.stroke(this.color)
      p5.rect(segment.pos.x, segment.pos.y, segment.width, segment.height)
    }
    p5.stroke('red')
    p5.line(
      this.pos.x + this.width / 2,
      this.pos.y + this.height / 2,
      this.pos.x + this.width / 2 + this.width * Math.cos(this.dir),
      this.pos.y + this.height / 2 + this.height * Math.sin(this.dir),
    )
    p5.stroke(this.color)
    if (this.showEyes) {
      for (let feeler of this.feelers) {
        p5.line(feeler.x1, feeler.y1, feeler.x2, feeler.y2)
      }
    }
  }
}
