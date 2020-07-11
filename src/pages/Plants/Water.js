import { checkCell, updateWorld } from './SimOperations'
import Steam from './Steam'
import Air from './Air'
export default class Water extends Air {
  constructor(x, y) {
    super(x, y)
    this.pos = {x: x, y: y}
    this.sync = 0
    this.transparencyBase = 0.9
    this.transparencyActual = 0.9
    this.updateInterval = 2
    this.defaultUpdateInterval = 2
    this.needsUpdate = true
    this.type = 'fluid'
    this.direction = Math.sign(Math.random() * 2 - 1)
    this.wallsHit = 0
    this.sunAbsorbed = 0
  }

  update(world, worldSize, timer, sunPos) {
    this.updateEnergy(world, sunPos)
    if (timer === this.sync || timer % this.updateInterval !== 0) return
    let newCellPos = checkCell(worldSize, this.pos, {x: 0, y: 1})
    if (newCellPos !== null && world[newCellPos.x][newCellPos.y].type === 'air') {
      updateWorld(world, timer, this, newCellPos)
      this.reset()
    } 
    else {
      // first check random direction
      newCellPos = checkCell(worldSize, this.pos, {x: this.direction, y: 0})
      if (newCellPos !== null && world[newCellPos.x][newCellPos.y].type === 'air') {
        updateWorld(world, timer, this, newCellPos)
      } 
      //else if (this.wallsHit > Math.floor(Math.random() * 50 + 2)) {
        //if (newCellPos !== null) {
          //this.direction = Math.sign(Math.random() * 2 - 1)
          //this.updateInterval++
          //this.wallsHit = 0
        //}
      //}
      else {
        this.direction = this.direction * -1
        //this.wallsHit ++
      }
    }
    this.sync = timer
  }

  updateEnergy(world, sunPos) {
    //if (this.pos.y > 0) {
      //if (world[this.pos.x][this.pos.y - 1] === undefined) {
        //this.sunAbsorbed += Math.max(sunPos, 0)
      //}
    //} else {
      //this.sunAbsorbed += Math.max(sunPos, 0)
    //}
    this.sunAbsorbed += Math.max(sunPos, 0) * this.transparencyBase === 0 ? 0 : this.transparencyActual / this.transparencyBase
    // lose some absorbed energy at night
    this.sunAbsorbed += Math.min(sunPos/4, 0)
    this.sunAbsorbed = Math.max(this.sunAbsorbed, 0)
    if (this.sunAbsorbed > 2000) {
      world[this.pos.x][this.pos.y] = new Steam(this.pos.x, this.pos.y)
    }
  }

  reset = () => {
    this.wallsHit = 0
    this.updateInterval = this.defaultUpdateInterval
    this.direction = Math.sign(Math.random() * 2 - 1)
  }

  draw(p5, cellSize) {
    //p5.stroke('#0033cc')
    //p5.fill('#0033cc')
    //console.log(this.transparencyActual / this.transparencyBase)
    let blue = this.transparencyActual
    p5.fill(p5.color(0, 40, 220 * blue))
    p5.stroke(p5.color(0, 40, 220 * blue))
    // p5.stroke('white')
    p5.rect(this.pos.x * cellSize, this.pos.y*cellSize, cellSize, cellSize)
  }
}
