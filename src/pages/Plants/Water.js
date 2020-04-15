import { checkCell, updateWorld } from './SimOperations'
export default class Water {
  constructor(x, y) {
    this.pos = {x: x, y: y}
    this.sync = 0
    this.updateInterval = 2
    this.defaultUpdateInterval = 2
    this.type = 'fluid'
    this.direction = Math.sign(Math.random() * 2 - 1)
    this.wallsHit = 0
  }

  update(world, worldSize, timer) {
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    let newCellPos = checkCell(worldSize, this.pos, {x: 0, y: 1})
    if (newCellPos !== null && world[newCellPos.x][newCellPos.y] === undefined) {
      updateWorld(world, timer, this, newCellPos)
      this.reset()
    } 
    else {
      // first check random direction
      newCellPos = checkCell(worldSize, this.pos, {x: this.direction, y: 0})
      if (newCellPos !== null && world[newCellPos.x][newCellPos.y] === undefined) {
        updateWorld(world, timer, this, newCellPos)
      } 
      else if (this.wallsHit > Math.floor(Math.random() * 50 + 2)) {
        if (newCellPos !== null) {
          this.direction = Math.sign(Math.random() * 2 - 1)
          this.updateInterval++
          this.wallsHit = 0
        }
      }
      else {
        this.direction = Math.sign(Math.random() * 2 - 1)
        this.wallsHit ++
      }
    }
  }

  reset = () => {
    this.wallsHit = 0
    this.updateInterval = this.defaultUpdateInterval
    this.direction = Math.sign(Math.random() * 2 - 1)
  }

  draw(p5, cellSize) {
    p5.stroke('#0033cc')
    p5.fill('#0033cc')
    // p5.stroke('white')
    p5.rect(this.pos.x * cellSize, this.pos.y*cellSize, cellSize, cellSize)
  }
}
