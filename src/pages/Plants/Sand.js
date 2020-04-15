import { checkCell, updateWorld } from './SimOperations'
export default class Sand {
  constructor(x, y) {
    this.pos = {x: x, y: y}
    this.sync = 0
    this.settled = false
    this.updateInterval = 2
    this.type = 'sand'
  }

  update(world, worldSize, timer) {
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    let newCellPos = checkCell(worldSize, this.pos, {x: 0, y: 1})
    if (newCellPos !== null) {
      if (world[newCellPos.x][newCellPos.y] === undefined) {
        updateWorld(world, timer, this, newCellPos)
      } 
      else if (world[newCellPos.x][newCellPos.y].type === 'fluid'){
        // swap position with fluid cell
        world[newCellPos.x][newCellPos.y].pos = this.pos
        world[newCellPos.x][newCellPos.y].reset()
        world[this.pos.x][this.pos.y] = world[newCellPos.x][newCellPos.y]
        world[newCellPos.x][newCellPos.y] = this
        this.pos = newCellPos
        this.sync = timer
      }
      else {
        // first check random direction
        let dir = Math.sign(Math.random() * 2 - 1)
        newCellPos = checkCell(worldSize, this.pos, {x: dir, y: 1})

        if (!this.settled && newCellPos !== null && world[newCellPos.x][newCellPos.y] === undefined) {
          updateWorld(world, timer, this, newCellPos)
        } else {
          this.settled = true
        }
      }
    } 
  }

  draw(p5, cellSize) {
    p5.stroke('#855723')
    p5.fill('#855723')
    // p5.stroke('white')
    p5.rect(this.pos.x * cellSize, this.pos.y*cellSize, cellSize, cellSize)
  }
}
