import { checkCell, updateWorld, swapCells } from './SimOperations'
import Air from './Air'
export default class Sand extends Air {
  constructor(x, y) {
    super(x, y)
    this.pos = {x: x, y: y}
    this.sync = 0
    this.transparencyBase = 0.35
    this.transparencyActual = 0.35
    this.settled = false
    this.updateInterval = 1
    this.needsUpdate = true
    this.type = 'sand'
    this.baseRed = 133 + Math.random() * 10 - 5
    this.color = [this.baseRed, 87, 35]
    this.wetness = 0
  }

  update(world, worldSize, timer) {
    this.color[0] = this.baseRed - 40 * this.wetness
    this.color[1] = 87 - 50 * this.wetness
    this.color[2] = 35 - 20 * this.wetness
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    if (this.wetness > 0) {
      // attempt to spread wetness every 30 ticks
      if (timer % 30 === 0 && this.wetness > 0.1) {
        let spreadCellPos = checkCell(worldSize, this.pos, {x: Math.round(Math.random() * 2 - 1), y: Math.round(Math.random() * 2 - 1)})
        if (spreadCellPos !== null) {
          let spreadCell = world[spreadCellPos.x][spreadCellPos.y]
          if (spreadCell.type === 'sand' && spreadCell.wetness < this.wetness) {
            spreadCell.wetness += 0.1
            spreadCell.needsUpdate = true
            this.wetness -= 0.1
          }
          else if (spreadCell.type === 'root') {
            console.log('yes')
            spreadCell.wetness += 0.2
            spreadCell.needsUpdate = true
            this.wetness -= 0.2
          }
        }
      }
    }
    let newCellPos = checkCell(worldSize, this.pos, {x: 0, y: 1})
    let newCell
    if (newCellPos !== null) {
      newCell = world[newCellPos.x][newCellPos.y]
      if (newCell.type === 'air') {
        updateWorld(world, timer, this, newCellPos)
      } 
      else {
        if (newCell.type === 'fluid' || newCell.type === 'gas'){
          swapCells(world, this.pos, newCellPos, timer)
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
          } 
          else {
            if (this.wetness <= 0.1) {
              this.needsUpdate = false
            }
          }
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
