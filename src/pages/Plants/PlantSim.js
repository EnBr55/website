import Sand from './Sand'
import Water from './Water'
import Steam from './Steam'
export const PlantSim = (p5) => {
  // props
  let simulationSpeed
  let cellType

  let world = []
  let worldSize = 128
  let timer = 0
  let dayLength = 1000
  let windowDimensions = {
    width: Math.min(p5.windowWidth / 1.3, p5.windowHeight / 1.3),
    height: Math.min(p5.windowWidth / 1.3, p5.windowHeight / 1.3),
  }
  let cellSize = windowDimensions.width / worldSize
  let mousePos = { x: 0, y: 0 }

  p5.setup = () => {
    p5.createCanvas(windowDimensions.width, windowDimensions.height)
    p5.frameRate(60)
    simulationSpeed = 1
    for (let i = 0; i < worldSize; i++) {
      world.push([])
      for (let j = 0; j < worldSize; j++) {
        world[i].push(undefined)
      }
    }
  }

  p5.windowResized = () => {
    windowDimensions = {
      width: Math.min(p5.windowWidth / 1.3, p5.windowHeight / 1.3),
      height: Math.min(p5.windowWidth / 1.3, p5.windowHeight / 1.3),
    }
    p5.resizeCanvas(windowDimensions.width, windowDimensions.height)
    cellSize = windowDimensions.width / worldSize
  }

  p5.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    simulationSpeed = props.simSpeed
    cellType = props.cellType
  }

  const onMousePress = () => {
    if (
      Math.floor(p5.mouseX / cellSize) !== mousePos.x ||
      Math.floor(p5.mouseY / cellSize) !== mousePos.y
    ) {
      return
    }
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
      default:
        newCell = new Sand(clickedPos.x, clickedPos.y)
        break
    }
    world[clickedPos.x][clickedPos.y] = newCell
  }

  p5.draw = () => {
    let sunPos = -1*Math.sin(timer/dayLength - Math.PI/2)
    p5.background(50 + 80*(1-sunPos**2), 60 + 50*sunPos, 150 + (sunPos**2)*100 + sunPos*90)
    
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

    for (let i = 0; i < simulationSpeed; i++) {}
    for (let outer of world) {
      for (let inner in outer) {
        let cell = outer[outer.length - 1 - inner]
        if (cell) {
          cell.update(world, worldSize, timer, sunPos)
          cell.draw(p5, cellSize)
        }
      }
    }
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
  }
}
