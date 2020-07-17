import { checkCell, updateWorld, swapCells } from './SimOperations'
import Air from './Air'
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
    this.plantId = 0
    this.baseGreen = 160 + Math.random()*20
    this.color = [33, this.baseGreen, 14 + Math.random()*10]
    this.wetness = 0
    this.energy = 0.5
  }

  update(world, worldSize, timer, sunPos) {
    this.color[1] = this.baseGreen * this.energy
    this.updateEnergy(world, sunPos)
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    this.sync = timer
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
