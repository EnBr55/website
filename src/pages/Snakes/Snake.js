export default class Snake {
  constructor(x, y, dna) {
    this.dna = dna

    this.alive = true
    this.width = 50
    this.height = 50

    this.pos = { x: x, y: y }
    this.vel = { x: 0, y: 0 }
    this.speed = 0
    this.dir = Math.random() * 2 * Math.PI - Math.PI

    this.history = Array(60).fill({ x: this.pos.x, y: this.pos.y })
    this.time = 0
    this.clock = 0

    this.segments = [{ x: this.pos.x, y: this.pos.y, width: this.width, height: this.height }]
    
    this.numTailSegments = 4
    this.tailSegmentOffset = Math.floor(60/this.numTailSegments)

    for (let i = 1; i < this.numTailSegments+1; i++) {
      this.segments.push({ 
        x: this.history[(this.clock + this.tailSegmentOffset*i) % 60].x,
        y: this.history[(this.clock + this.tailSegmentOffset*i) % 60].y,
        width: this.width - this.width * 0.1 * i,
        height: this.height - this.width * 0.1 * i
      })
    }
  }
  

  update() {
    if (this.alive) {
      this.clock++ 

      this.history[this.clock % 60] = { x: this.pos.x, y: this.pos.y }

      this.segments[0].x = this.pos.x
      this.segments[0].y = this.pos.y
      for (let i = 1; i < this.numTailSegments+1; i++) {
        this.segments[i].x = this.history[(this.clock + this.tailSegmentOffset*i) % 60].x
        this.segments[i].y = this.history[(this.clock + this.tailSegmentOffset*i) % 60].y
      }
    }
    if (this.clock%60===0) {console.log(this.history)}
    //console.log(Math.floor(this.clock / 60))

  }

  draw(p5) {
    for (let segment of this.segments) {
      p5.rect(segment.x, segment.y, segment.width, segment.height)
    }
  }
}
