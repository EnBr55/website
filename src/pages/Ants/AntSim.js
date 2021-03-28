import Ant from './Classes/Ant'
import { isOutOfBounds } from './simOperations'
export const AntSim = (p5) => {

  // defaults
  console.log('first')
  let WIDTH = 256
  let TRAIL_LENGTH = 2
  let NUM_ANTS = 0
  let ANT_SPEED = 2.3
  let ANT_FOLLOW_PROB = 5
  let ANT_TURN_RATE = 0.5
  let ANT_VISION_RANGE = 4

  const getWindowDimensions = () => {
    return {
      //width: Math.min(p5.windowWidth * CANVAS_SCALE_FACTOR,
        //p5.windowHeight * CANVAS_SCALE_FACTOR),
      //height: Math.min(p5.windowWidth * CANVAS_SCALE_FACTOR,
        //p5.windowHeight * CANVAS_SCALE_FACTOR),
      width: WIDTH,
      height: WIDTH
    }
  }
  let windowDimensions = getWindowDimensions()

  let ants = []
  let dt = 0;

  let pixelsHorizontal

  p5.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    console.log(props)
    WIDTH = props.width
    TRAIL_LENGTH = props.trailLength
    NUM_ANTS = props.numAnts
    ANT_SPEED = props.antSpeed
    ANT_FOLLOW_PROB = props.antFollowMod
    ANT_TURN_RATE = props.antTurnRate
    ANT_VISION_RANGE = props.antVisionRange

    ants = []
    windowDimensions = getWindowDimensions()

    p5.background(30, 30, 30)
    p5.pixelDensity(1)
    p5.loadPixels()
    p5.background(70, 70, 70)
    p5.createCanvas(windowDimensions.width, windowDimensions.height)
    //pixelsHorizontal = Math.sqrt(p5.pixels.length / 4)
    pixelsHorizontal = Math.floor(windowDimensions.width)
    p5.frameRate(60)
    
    for (let i = 0; i < NUM_ANTS; i++) {
      ants.push(new Ant(
        //Math.random() * windowDimensions.width/2 + windowDimensions.width/4,
        //Math.random() * windowDimensions.width/2 + windowDimensions.width/4,
        windowDimensions.width/2,
        windowDimensions.width/2,
        TRAIL_LENGTH,
        ANT_SPEED,
        ANT_FOLLOW_PROB,
        ANT_TURN_RATE
      ))
    }
  }

  p5.setup = (props) => {
  }

  //p5.windowResized = () => {
    //windowDimensions = getWindowDimensions()
    //p5.resizeCanvas(windowDimensions.width, windowDimensions.height)
    ////pixelsHorizontal = Math.sqrt(p5.pixels.length / 4)
    //pixelsHorizontal = Math.floor(windowDimensions.width)
  //}

  const getPixelIndex = (xpos, ypos) => {
    return Math.floor(pixelsHorizontal*4*Math.floor(ypos) + 4*(Math.floor(xpos)))
  }

  const getPixelColor = (pixelIndex) => {
    return [p5.pixels[pixelIndex], p5.pixels[pixelIndex+1], p5.pixels[pixelIndex+2]]
  }

  const getAverageColor = (xpos, ypos) => {
    if (xpos == 0 || ypos ==0 || xpos==pixelsHorizontal || ypos==pixelsHorizontal) {
      return [70, 70, 70]
    }
    let index
    let color_avg = [0, 0, 0]
    let color
    for (let a = -1; a < 2; a++) {
      for (let b = -1; b < 2; b++) {
        index = getPixelIndex(xpos+a, ypos+b)
        color = getPixelColor(index)
        color_avg[0] += color[0]/9
        color_avg[1] += color[1]/9
        color_avg[2] += color[2]/9
      }
    }
    return color_avg
  }

  const drawPixel = (color, xpos, ypos, drawWidth) => {
    let firstIndex = getPixelIndex(xpos, ypos)
    let index
    for (let i = 0; i < drawWidth; i++) {
      for (let j = 0; j < drawWidth; j++) {
        index = firstIndex + i*pixelsHorizontal*4 + j*4
        //index = firstIndex + i*drawWidth
        p5.pixels[index] = color[0]
        p5.pixels[index + 1] = color[1]
        p5.pixels[index + 2] = color[2]
        // default to max alpha
        p5.pixels[index + 3] = 255
      }
    }
  }

  const samplePoints = (pos, angle) => {
    let lookAhead = ANT_VISION_RANGE
    let forwards = { x: pos.x + lookAhead*Math.cos(angle) ,
                     y: pos.y + lookAhead*Math.sin(angle)
    }
    //drawPixel([255,0, 0], forwards.x, forwards.y, 1)
    let left = { x: pos.x + lookAhead*Math.cos(angle - Math.PI / 4),
                 y: pos.y + lookAhead*Math.sin(angle - Math.PI / 4)

    }
    let right = { x: pos.x + lookAhead*Math.cos(angle + Math.PI / 4),
                  y: pos.y + lookAhead*Math.sin(angle + Math.PI / 4)
    }
    let col1
    let col2
    let col3
    
    if (isOutOfBounds(forwards, windowDimensions)) {
      col1 = [0, 0, 0]
    } else { col1 = getPixelColor(getPixelIndex(forwards.x, forwards.y))}
    if (isOutOfBounds(left, windowDimensions)) {
      col2 = [-100, -100, -100]
      col1 = [-100, -100, -100]
    } else { col2 = getPixelColor(getPixelIndex(left.x, left.y))}
    if (isOutOfBounds(right, windowDimensions)) {
      col3 = [-100, -100, -100]
      col1 = [-100, -100, -100]
    } else { col3 = getPixelColor(getPixelIndex(right.x, right.y))}
    return [col1, col2, col3]
  }

  p5.draw = () => {
    dt++
    //p5.background(70, 70, 70)
    if (dt === 1) {p5.background(30, 30, 30)}
    p5.loadPixels()
    for (let ant of ants) {
      ant.update(windowDimensions, dt % TRAIL_LENGTH, samplePoints)
      ant.draw(drawPixel, getAverageColor)
    }
    p5.updatePixels()

    if (dt % 1 === 0) {
     p5.filter(p5.BLUR, 1)
    }
  }
  
  p5.keyPressed = (a) => {
    console.log(a.code)
  }
}
