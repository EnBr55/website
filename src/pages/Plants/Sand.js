import { checkCell, updateWorld, swapCells, isValidPos } from './SimOperations'
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

  update(world, timer) {
    this.color[0] = this.baseRed - 40 * this.wetness
    this.color[1] = 87 - 50 * this.wetness
    this.color[2] = 35 - 20 * this.wetness
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    if (this.wetness > 0) {
      // attempt to spread wetness every 30 ticks
      if (timer % 30 === 0 && this.wetness > 0.1) {
        let spreadCell = checkCell(world, this.pos, {x: Math.round(Math.random() * 2 - 1), y: Math.round(Math.random() * 2 - 1)})
        if (spreadCell !== null) {
          if (spreadCell.type === 'sand' && spreadCell.wetness < this.wetness) {
            spreadCell.wetness += 0.1
            spreadCell.needsUpdate = true
            this.wetness -= 0.1
          }
          else if (spreadCell.type === 'root' && spreadCell.wetness < 1) {
            console.log('yes')
            spreadCell.wetness += 0.2
            spreadCell.needsUpdate = true
            this.wetness -= 0.2
          }
        }
      }
    }

    if (!this.attemptMove(world, {x: 0, y: 1}, ['air'])) {
      // if not swapped with air but swapped with fluid/gas
      if (this.attemptMove(world, {x: 0, y: 1}, ['fluid', 'gas'])) {
          let swappedCell = checkCell(world, this.pos, {x: 0, y: - 1})
          let topCell = checkCell(world, swappedCell.pos, {x: 0, y: - 1})
          if (topCell && topCell.type == 'sand') {
            ! swappedCell.attemptMove(world, {x: 1, y: 0}, ['air']) &&
              swappedCell.attemptMove(world, {x: 1, y: 0}, ['air'])
          }
      } else {
          // first check random direction
          let dir = Math.sign(Math.random() * 2 - 1)
          if (!this.attemptMove(world, {x: dir, y: 1}, ['air'])) {
            if (this.wetness <= 0.1) {
              this.needsUpdate = false
            }
          }
      }
    }
    this.sync = timer
  }

  draw(p5, cellSize) {
    p5.stroke(this.color)
    p5.fill(this.color)
    // p5.stroke('white')
    p5.rect(this.pos.x * cellSize, this.pos.y*cellSize, cellSize, cellSize)
  }
}
