export default class Snake {
  constructor(x, y, dna) {
    this.dna = dna
    this.color = [0, 200, 50, 100]

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

    this.numFeelers = 4
    this.feelerLength = 200
    this.feelers = []
    for (let i = 1; i < this.numFeelers + 1; i++) {
      // Divide a semicircle in n+1 equal section with n lines (feelers)
      // Assume angle of 0 goes through the centre of the semicircle such that -PI/2 is the start
      let angle = (-Math.PI / 2) + (i * Math.PI / (this.numFeelers + 1))
      this.feelers.push({
        x1: this.pos.x + this.width / 2,
        x2: this.pos.x + this.width / 2 + this.feelerLength * Math.cos(this.dir - angle),
        y1: this.pos.y + this.height / 2,
        y2: this.pos.y + this.height / 2 + this.feelerLength * Math.sin(this.dir - angle)
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
  }

  update(windowDimensions) {
    if (this.alive) {
      this.speed = Math.random() * 5
      this.clock++

      // Update position
      this.vel.x = this.speed * Math.cos(this.dir)
      this.vel.y = this.speed * Math.sin(this.dir)

      // Check walls
      if (this.pos.x <= 0) {
        this.vel.x = 0.1
        this.facing += 0.1
      }
      if (this.pos.x >= windowDimensions.width - this.width) {
        this.vel.x = -0.1
        this.facing += 0.1
      }
      if (this.pos.y <= 0) {
        this.vel.y = 0.1
        this.facing += 0.1
      }
      if (this.pos.y >= windowDimensions.height - this.height) {
        this.vel.y = -0.1
        this.facing += 0.1
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
      if (this.hunger.current > this.hunger.max) {
        this.alive = false
      }
    } else {
      this.color = [255 * 0.803, 255 * 0.03, 255 * 0.04, 80]
    }
    //console.log(Math.floor(this.clock / 60))
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
    for (let feeler of this.feelers) {
      p5.line(feeler.x1, feeler.y1, feeler.x2, feeler.y2)
    }
  }
}
