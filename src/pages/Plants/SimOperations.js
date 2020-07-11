import Air from './Air'
export const checkCell = (worldSize, currentPos, direction) => {
  let newX = currentPos.x + direction.x
  let newY = currentPos.y + direction.y
  if (newX >=0 && newX < worldSize && newY >= 0 && newY < worldSize) {
    return {x: newX, y: newY}
  }
  return null
}

export const updateWorld = (world, timer, object, objectNewPos) => {
  const worldSize = world.length
  world[object.pos.x][object.pos.y] = new Air(object.pos.x, object.pos.y)
  object.pos.x = objectNewPos.x
  object.pos.y = objectNewPos.y
  object.sync = timer
  world[objectNewPos.x][objectNewPos.y] = object

  // left
  if (objectNewPos.x > 0) {
    world[objectNewPos.x - 1][objectNewPos.y].needsUpdate = true
  }
  // right
  if (objectNewPos.x < worldSize - 1) {
    world[objectNewPos.x + 1][objectNewPos.y].needsUpdate = true
  }
  if (objectNewPos.y > 0) {
    world[objectNewPos.x][objectNewPos.y - 1].needsUpdate = true
  }
  // down
  if (objectNewPos.y < worldSize - 1) {
    world[objectNewPos.x][objectNewPos.y + 1].needsUpdate = true
  }

}

export const swapCells = (world, cell1, cell2) => {
  const oldCell = world[cell1.x][cell1.y]
  world[cell2.x][cell2.y].pos = world[cell1.x][cell1.y].pos
  world[cell2.x][cell2.y].reset()
  world[cell1.x][cell1.y] = world[cell2.x][cell2.y]
  world[cell2.x][cell2.y] = oldCell
  oldCell.pos = cell2
}

export const getTransparency = (world, direction) => {
}
