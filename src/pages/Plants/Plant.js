import { checkCell, updateWorld, swapCells } from './SimOperations'
import Air from './Air'
import Sand from './Sand'
export default class Plant extends Air {
  constructor(x, y) {
    super(x, y)
    this.pos = {x: x, y: y}
    this.sync = 0
    this.transparencyBase = 0.6
    this.transparencyActual = 0.6
    this.updateInterval = 1
    this.needsUpdate = true
    this.type = 'plant'
    this.plantId = Math.random()
    this.baseRed = 33
    this.baseGreen = 160 + Math.random()*20
    this.baseBlue = 14 + Math.random()*10
    this.color = [this.baseRed, this.baseGreen, this.baseBlue] 
    this.wetness = 0.6
    this.energy = 0.6
  }

  update(world, worldSize, timer, sunPos) {
    // energy color adjustments
    
    this.color[1] = this.baseGreen * Math.max(this.energy * this.wetness, 0.1)
    // moisture color adjustments
    this.color[0] = this.baseRed  * Math.max(0.2, this.wetness)
    this.color[2] = this.baseBlue * Math.max(0.2, this.wetness)
    this.updateEnergy(world, sunPos)
    if (timer === this.sync || timer % this.updateInterval !== 0) return

    if (this.energy <= 0) {
      world[this.pos.x][this.pos.y] = new Sand(this.pos.x, this.pos.y)
    }

    if (timer % 300 === 0) {
      let newPos = {x: Math.round(Math.random() * 2 - 1), y: Math.round(Math.random() * 2 - 1)}
      let cell = checkCell(worldSize, this.pos, newPos)
      if (cell !== null && world[cell.x][cell.y].type === 'air') {
        if (this.energy > 0.5 && this.wetness > 0.5) {
          this.spreadPlant(world, {x: this.pos.x + newPos.x, y: this.pos.y + newPos.y})
        }
      }
    }

    this.sync = timer
  }

  spreadPlant(world, newPos) {
    world[newPos.x][newPos.y] = new Plant(newPos.x, newPos.y)
    world[newPos.x][newPos.y].plantId = this.plantId
    //this.wetness -= 0.5
    this.energy -= 0.5
  }

  updateEnergy(world, sunPos) {
    let energyGainBaseMultiplier = 0.00005
    this.energy = Math.max(Math.min(this.energy + sunPos * (this.transparencyActual / this.transparencyBase) * energyGainBaseMultiplier, 1), 0)

    this.energy = Math.max(this.energy - energyGainBaseMultiplier * 0.005, 0)
    //this.energy = Math.max(0.000000001*Math.max(sunPos, 0) * this.transparencyBase === 0 ? 0 : this.transparencyActual / this.transparencyBase, 1)
    // lose some absorbed energy at night
    //this.energy += Math.min(sunPos/4, 0)
    //this.energy = Math.max(this.energy, 0)
  }


  draw(p5, cellSize) {
    p5.stroke(this.color)
    p5.fill(this.color)
    // p5.stroke('white')
    p5.rect(this.pos.x * cellSize, this.pos.y*cellSize, cellSize, cellSize)
  }
}
