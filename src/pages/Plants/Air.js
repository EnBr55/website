import { checkCell, updateWorld, swapCells } from './SimOperations'
export default class Air {
  constructor(x, y) {
    this.pos = {x: x, y: y}
    this.transparencyBase = 1
    this.transparencyActual = 1
    this.needsUpdate = false
    this.type = 'air'
    this.color = [0, 0, 0]
  }

  update(world, timer) {
    this.needsUpdate = false
  }

  attemptMove(world, direction, swapTargets) {
    let cell = checkCell(world, this.pos, direction)
    if (cell && swapTargets.includes(cell.type)) {
      swapCells(world, this.pos, cell.pos)
      return true
    }
    return false
  }

  draw(p5, cellSize) {
  }

  reset() {
  }

}
