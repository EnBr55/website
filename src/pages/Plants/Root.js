import { checkCell, updateWorld, swapCells } from './SimOperations'
import Air from './Air'
export default class Root extends Air {
  constructor(x, y) {
    super(x, y)
    this.pos = {x: x, y: y}
    this.sync = 0
    this.transparencyBase = 0.35
    this.transparencyActual = 0.35
    this.updateInterval = 1
    this.needsUpdate = true
    this.type = 'root'
    this.plantId = 0
    this.color = [207, 193 + Math.random()*20, 171 + Math.random()*10]
    this.wetness = 0
    this.energy = 1
  }

  update(world, worldSize, timer) {
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    this.sync = timer
  }

  draw(p5, cellSize) {
    p5.stroke(this.color)
    p5.fill(this.color)
    // p5.stroke('white')
    p5.rect(this.pos.x * cellSize, this.pos.y*cellSize, cellSize, cellSize)
  }
}
