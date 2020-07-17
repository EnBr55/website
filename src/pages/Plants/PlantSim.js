import Air from './Air'
import Sand from './Sand'
import Water from './Water'
import Steam from './Steam'
import Root from './Root'
import Plant from './Plant'
export const PlantSim = (p5) => {
  // props
  let simulationSpeed
  let cellType

  let activeCells = 0
  let world = []
  let worldSize = 150
  let timer = -2000
  let dayLength = 5000
  let windowDimensions = {
    width: Math.min(p5.windowWidth / 1.3, p5.windowHeight / 1.3),
    height: Math.min(p5.windowWidth / 1.3, p5.windowHeight / 1.3),
  }
  let cellSize = windowDimensions.width / worldSize
  let mousePos = { x: 0, y: 0 }

  let pixelsHorizontal
  let cellWidth

  p5.setup = () => {
    p5.pixelDensity(1)
    p5.createCanvas(windowDimensions.width, windowDimensions.height)
    p5.frameRate(60)
    simulationSpeed = 1
    for (let i = 0; i < worldSize; i++) {
      world.push([])
      for (let j = 0; j < worldSize; j++) {
        if (j > worldSize/1.05) {
          world[i].push(new Sand(i, j))
        } else {
          world[i].push(new Air(i, j))
        }
      }
    }
    p5.loadPixels()
    // number of pixels in one row
    pixelsHorizontal = Math.sqrt(p5.pixels.length / 4)
    //pixelsHorizontal = windowDimensions.width
    cellWidth = pixelsHorizontal / worldSize
  }

  p5.windowResized = () => {
    windowDimensions = {
      width: Math.min(p5.windowWidth / 1.3, p5.windowHeight / 1.3),
      height: Math.min(p5.windowWidth / 1.3, p5.windowHeight / 1.3),
    }
    p5.resizeCanvas(windowDimensions.width, windowDimensions.height)
    cellSize = windowDimensions.width / worldSize
    pixelsHorizontal = Math.sqrt(p5.pixels.length / 4)
    cellWidth = pixelsHorizontal / worldSize
  }

  p5.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    simulationSpeed = props.simSpeed
    cellType = props.cellType
  }

  const onMousePress = () => {
    //if (
      //Math.floor(p5.mouseX / cellSize) !== mousePos.x ||
      //Math.floor(p5.mouseY / cellSize) !== mousePos.y
    //) {
      //return
    //}
    let clickedPos = mousePos
    let newCell
    switch (cellType) {
      case 'sand':
        newCell = new Sand(clickedPos.x, clickedPos.y)
        break
      case 'water':
        newCell = new Water(clickedPos.x, clickedPos.y)
        break
      case 'steam':
        newCell = new Steam(clickedPos.x, clickedPos.y)
        break
      case 'root':
        newCell = new Root(clickedPos.x, clickedPos.y)
        break
      case 'plant':
        newCell = new Plant(clickedPos.x, clickedPos.y)
        break
      default:
        newCell = new Sand(clickedPos.x, clickedPos.y)
        break
    }
    world[clickedPos.x][clickedPos.y] = newCell
  }

  const drawPixel = (color, xpos, ypos) => {
    //p5.pixels[pixelsHorizontal*4 - 3] = 255
    //p5.pixels[pixelsHorizontal*4*Math.floor(cellWidth*127) + 4*(Math.floor(cellWidth*127))] = 255
    let firstIndex = Math.floor(pixelsHorizontal*4*Math.floor(cellWidth*ypos) + 4*(Math.floor(cellWidth*xpos)))
    let index
    for (let i = 0; i < cellWidth; i++) {
      for (let j = 0; j < cellWidth; j++) {
        index = firstIndex + i*pixelsHorizontal*4 + j*4
        //index = firstIndex + i*cellWidth
        p5.pixels[index] = color[0]
        p5.pixels[index + 1] = color[1]
        p5.pixels[index + 2] = color[2]
        // default to max alpha
        p5.pixels[index + 3] = 255
      }
    }
  }

  p5.draw = () => {
    let sunPos = Math.sin((timer/dayLength + Math.PI/2))
    let sunDirection = Math.cos(timer/dayLength - Math.PI/2)
    p5.background(50 + 80*(1-sunPos**2), 60 + 50*sunPos, 150 + (sunPos**2)*100 + sunPos*90)

    //if (timer % 3 == 0) {console.log(Math.cos(timer/dayLength - Math.PI/2))}
    
    timer += 1

    if (p5.mouseIsPressed) {
      onMousePress()
    }
    mousePos = {
      x: Math.min(Math.max(Math.floor(p5.mouseX / cellSize), 0), worldSize - 1),
      y: Math.min(Math.max(Math.floor(p5.mouseY / cellSize), 0), worldSize - 1),
    }
    p5.stroke('black')
    p5.noFill()
    p5.rect(mousePos.x * cellSize, mousePos.y * cellSize, cellSize, cellSize)

    // SUN
    p5.stroke('orange')
    p5.fill('yellow')
    p5.circle(
      windowDimensions.width/2 + windowDimensions.width/1.5 * Math.cos(timer/dayLength - Math.PI/2),
      windowDimensions.height/2 + windowDimensions.height/1.5 * Math.sin(timer/dayLength - Math.PI/2) + windowDimensions.height/4,
      windowDimensions.height/13
    )
    // MOON
    p5.fill('#99b')
    p5.noStroke()
    p5.circle(
      windowDimensions.width/2 + windowDimensions.width/1.5 * Math.cos(timer/dayLength + Math.PI/2),
      windowDimensions.height/2 + windowDimensions.height/1.5 * Math.sin(timer/dayLength + Math.PI/2) + windowDimensions.height/4,
      windowDimensions.height/20
    )

    for (let i = 0; i < simulationSpeed; i++) {}
    let cell
    //console.log('Active Cells: '+activeCells)
    activeCells = 0
    p5.loadPixels()
    for (let outer in world) {
      for (let inner in world[outer]) {
        let transparencyNoise = (1 - Math.random() * 0.001)
        cell = world[outer][world[outer].length - 1 - inner]
        if (cell) {
          // transparency propagation

          // offset based on position
          let thresholdOffset = (outer / world[0].length)
          // reset transparency each tick
          cell.transparencyActual = cell.transparencyBase
          let newX = cell.pos.x + ((sunDirection > 0.45 + thresholdOffset) ? 1 : (sunDirection < -0.45 - thresholdOffset) ? -1 : 0)
          let newY = cell.pos.y - 1
          if (newX < world.length && newX >= 0 && newY < world[0].length && newY >= 0) {
            let newCell = world[newX][newY]
            if (newCell && newCell !== cell) {
              cell.transparencyActual = cell.transparencyBase * (newCell.transparencyActual * transparencyNoise)
            }
          } else {
            cell.transparencyActual = cell.transparencyBase
          }

          if(cell.needsUpdate) {
            cell.update(world, worldSize, timer, sunPos)
            activeCells++
          }
          if(cell.type !== 'air') {
            drawPixel(cell.color, cell.pos.x, cell.pos.y)
          }
          //render && cell.draw(p5, cellSize)
        }
      }
    }
    p5.updatePixels()
  }

  p5.keyPressed = (a) => {
    console.log(a.code)
    if (a.code === "Space") {
      //render = !render
      console.log(p5.pixels)
      console.log(windowDimensions.width, pixelsHorizontal, cellWidth)
    }
  }
}
