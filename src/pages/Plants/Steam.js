import { checkCell, updateWorld, swapCells } from './SimOperations'
import Water from './Water'
import Air from './Air'
export default class Steam extends Air{
  constructor(x, y) {
    super(x, y)
    this.pos = {x: x, y: y}
    this.sync = 0
    this.transparencyBase = 0.98
    this.transparencyActual = 0.98
    this.updateInterval = 2
    this.defaultUpdateInterval = 2
    this.needsUpdate = true
    this.type = 'gas'
    this.direction = Math.sign(Math.random() * 2 - 1)
    this.wallsHit = 0
    this.sunAbsorbed = 0
    this.color = [150, 150, 150]
  }

  update(world, worldSize, timer, sunPos) {
    this.updateEnergy(world, sunPos)
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    let newCell = checkCell(world, this.pos, {x: 0, y: Math.round(Math.random() -1.4)})
    if (newCell !== null) {
      if (newCell.type === 'air') { 
        updateWorld(world, timer, this, newCell.pos)
        if (Math.round(Math.random() - 0.3)) {
          this.reset()
        }
      } 
      else if (newCell.type === 'fluid') {
        swapCells(world, this.pos, newCell.pos, timer)
      }
      else {
        if (newCell.type === 'gas') {
          if (Math.round(Math.random())) {
            this.updateInterval++
          }
        }
        // first check random direction
        newCell = checkCell(world, this.pos, {x: this.direction, y: Math.round(Math.random() * 2 - 1)})
        if (newCell !== null && newCell.type  === 'air') {
          updateWorld(world, timer, this, newCell.pos)
        } 
        else {
          this.direction = Math.sign(Math.random() * 2 - 1)
        }
      }
    } 
  }

  updateEnergy(world, sunPos) {
    if (this.pos.y < world.length) {
      if (this.pos.y < (world.length-1) && world[this.pos.x][this.pos.y + 1].type === 'air') {
        this.sunAbsorbed += Math.max(sunPos, 0)
      }
    } else {
      this.sunAbsorbed += Math.max(sunPos, 0)
    }
    // lose some absorbed energy at night
    this.sunAbsorbed += Math.min(sunPos/4, 0)
    this.sunAbsorbed = Math.max(this.sunAbsorbed, 0)
    if (this.sunAbsorbed > 7500) {
      world[this.pos.x][this.pos.y] = new Water(this.pos.x, this.pos.y)
    }
  }

  reset = () => {
    this.wallsHit = 0
    this.updateInterval = this.defaultUpdateInterval
    this.direction = Math.sign(Math.random() * 2 - 1)
  }

  draw(p5, cellSize) {
    p5.stroke('#887')
    p5.fill('#887')
    // p5.stroke('white')
    p5.rect(this.pos.x * cellSize, this.pos.y*cellSize, cellSize, cellSize)
  }
}
