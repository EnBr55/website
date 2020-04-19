import { checkCell, updateWorld, swapCells } from './SimOperations'
import Water from './Water'
export default class Steam {
  constructor(x, y) {
    this.pos = {x: x, y: y}
    this.sync = 0
    this.transparencyBase = 0.25
    this.transparencyActual = 0.25
    this.updateInterval = 2
    this.defaultUpdateInterval = 2
    this.type = 'gas'
    this.direction = Math.sign(Math.random() * 2 - 1)
    this.wallsHit = 0
    this.sunAbsorbed = 0
  }

  update(world, worldSize, timer, sunPos) {
    this.updateEnergy(world, sunPos)
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    let newCellPos = checkCell(worldSize, this.pos, {x: 0, y: -1})
    let newCell
    if (newCellPos !== null) {
      newCell = world[newCellPos.x][newCellPos.y]
      if (newCell === undefined) { 
        updateWorld(world, timer, this, newCellPos)
        this.reset()
      } 
      else if (newCell.type === 'fluid') {
        swapCells(world, this.pos, newCellPos)
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
  }

  updateEnergy(world, sunPos) {
    if (this.pos.y < world.length) {
      if (world[this.pos.x][this.pos.y + 1] === undefined) {
        this.sunAbsorbed += Math.max(sunPos, 0)
      }
    } else {
      this.sunAbsorbed += Math.max(sunPos, 0)
    }
    // lose some absorbed energy at night
    this.sunAbsorbed += Math.min(sunPos/4, 0)
    this.sunAbsorbed = Math.max(this.sunAbsorbed, 0)
    if (this.sunAbsorbed > 1500) {
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
