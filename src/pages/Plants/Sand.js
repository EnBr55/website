import { checkCell, updateWorld, swapCells } from './SimOperations'
import Air from './Air'
export default class Sand extends Air{
  constructor(x, y) {
    super(x, y)
    this.pos = {x: x, y: y}
    this.sync = 0
    this.transparencyBase = 0.35
    this.transparencyActual = 0.35
    this.settled = false
    this.updateInterval = 2
    this.needsUpdate = true
    this.type = 'sand'
    this.color = [133, 87, 35]
  }

  update(world, worldSize, timer) {
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    let newCellPos = checkCell(worldSize, this.pos, {x: 0, y: 1})
    let newCell
    if (newCellPos !== null) {
      newCell = world[newCellPos.x][newCellPos.y]
      if (newCell.type === 'air') {
        updateWorld(world, timer, this, newCellPos)
      } 
      else if (newCell.type === 'fluid' || newCell.type === 'gas'){
        swapCells(world, this.pos, newCellPos)
      }
      else {
        // first check random direction
        let dir = Math.sign(Math.random() * 2 - 1)
        newCellPos = checkCell(worldSize, this.pos, {x: dir, y: 1})
        if (newCellPos !== null) {
          newCell = world[newCellPos.x][newCellPos.y]
        }

        if (!this.settled && newCellPos !== null && newCell.type === 'air') {
          updateWorld(world, timer, this, newCellPos)
        } else {
          this.needsUpdate = false
        }
      }
    } else { this.needsUpdate = false }
    this.sync = timer
  }

  draw(p5, cellSize) {
    p5.stroke(this.color)
    p5.fill(this.color)
    // p5.stroke('white')
    p5.rect(this.pos.x * cellSize, this.pos.y*cellSize, cellSize, cellSize)
  }
}
