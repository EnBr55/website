import { isOutOfBounds } from '../simOperations'

const newPointFromVel = (pos, vel) => {
  return {
    x: pos.x + vel.x,
    y: pos.y + vel.y
  }
}

const getVel = (speed, angle) => {
  return {
    x: speed * Math.cos(angle),
    y: speed * Math.sin(angle)
  }
}

const colorToConcentration = (color, thisColor) => {
  //return (thisColor[0] - (255 - color[0]-30) + thisColor[1] - (255 - color[1]-30) + thisColor[2] - (255 - color[2]-30)) / (225*3)
  return ( color[0] - 30 + color[1]-30 + color[2] - 30 ) / (225*3)
}

export default class Ant {
  constructor(x, y, trailLength, speed, followProb, followRate, color) {
    this.pos = {x: x, y: y}
    this.trailLength = trailLength
    this.trail = new Array(trailLength).fill({x: 0, y: 0, intensity: 1})
    this.facing = Math.random() * 2 * Math.PI
    this.speed = speed
    this.vel = getVel(this.speed, this.facing)
    //this.color = [Math.random()*200, Math.random()*200, Math.random()*200, 255]
    this.color = [53, 233, 240, 255]
    this.radius = 1
    this.attraction = followRate
    this.followProbability = followProb
  }


  update(windowDimensions, index, samplePoints) {
    this.trail[index] = {...this.pos, intensity: 1}
    let colors = samplePoints(this.pos, this.facing)
    //let baseProbabilities = [0.98, 0.02, 0.02]
    let probabilities = colors.map(a => colorToConcentration(a, this.color))
    let indexOfMaxValue = probabilities.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)
    probabilities[0] = colorToConcentration([255 - colors[0][0], 255 - colors[0][1], 255 - colors[0][2]], this.color)
    probabilities[indexOfMaxValue] += this.followProbability
     
    probabilities = probabilities.map(a => a / (probabilities.reduce((i, j) => i + j)))
    //console.log(probabilities)
    let p0 = probabilities[0]
    let p1 = p0 + probabilities[1]
    let p2 = p1 + probabilities[2]
    let choice = Math.random()
    if (index === 0){
    //console.log(probabilities)
    }
    if (choice < p0) {
      //console.log('yo')
      this.facing += 0
    } else if (choice > p0 && choice < p1) {
      this.facing = this.facing - this.attraction * Math.PI/4
      //console.log('hi')
    } else {
      this.facing = this.facing + this.attraction * Math.PI/4
      //console.log('bye')
    }

    this.vel = getVel(this.speed, this.facing)

    let newPoint = newPointFromVel(this.pos, this.vel)
    while (isOutOfBounds(newPoint, windowDimensions)) {
      this.facing = Math.random() * 2 * Math.PI
      this.vel = getVel(this.speed*4, this.facing)
      newPoint = newPointFromVel(this.pos, this.vel)
    }
    this.pos = newPoint

  }

  draw(drawFunc, getAverageColor) {
    drawFunc(this.color, this.pos.x, this.pos.y, this.radius)
    for (let t in this.trail) {
      //this.trail[t].intensity = this.trail[t].intensity -= 1/(this.trail.length*1.1)
      drawFunc(this.color, this.trail[t].x, this.trail[t].y, this.radius)
      //drawFunc(this.color.map(a => a * this.trail[t].intensity), this.trail[t].x, this.trail[t].y, this.radius)
    }
    //console.log(getAverageColor(this.pos.x, this.pos.y))
  }

  reset() {
  }

}
