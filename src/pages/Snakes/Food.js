export default class Food {
  constructor(x, y, w, h, color) {
    this.pos = { x: x, y: y }
    this.width = w
    this.height = h
    this.color = color
  }

  draw(p5) {
    p5.fill(this.color)
    p5.stroke('white')
    p5.rect(this.pos.x, this.pos.y, this.width, this.height)
    p5.rect(this.pos.x + this.width/4, this.pos.y + this.height/4, this.width/2, this.height/2)
    p5.rect(this.pos.x + 6/16*this.width, this.pos.y + 6/16*this.height, this.width/4, this.height/4)
  }
}
