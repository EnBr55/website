import Air from './Air'
export const checkCell = (world, currentPos, direction) => {
  let newX = currentPos.x + direction.x
  let newY = currentPos.y + direction.y
  if (newX >=0 && newX < world.length && newY >= 0 && newY < world.length) {
    return world[newX][newY]
  }
  return null
}

export const isValidPos = (world, x, y) => {
  return x < world.length && x >= 0 && y < world.length && y >= 0
}

export const updateWorld = (world, timer, object, objectNewPos) => {
  const worldSize = world.length
  world[object.pos.x][object.pos.y] = new Air(object.pos.x, object.pos.y)

  // left
  if (objectNewPos.x > 0) {
    world[objectNewPos.x - 1][objectNewPos.y].needsUpdate = true
  }
  if (object.pos.x > 0) {
    world[object.pos.x - 1][object.pos.y].needsUpdate = true
  }
  // right
  if (objectNewPos.x < worldSize - 1) {
    world[objectNewPos.x + 1][objectNewPos.y].needsUpdate = true
  }
  if (objectNewPos.y > 0) {
    world[objectNewPos.x][objectNewPos.y - 1].needsUpdate = true
  }
  if (object.pos.y > 0) {
    world[object.pos.x][object.pos.y - 1].needsUpdate = true
  }
  // down
  if (objectNewPos.y < worldSize - 1) {
    world[objectNewPos.x][objectNewPos.y + 1].needsUpdate = true
  }
  if (object.pos.y < worldSize - 1) {
    world[object.pos.x][object.pos.y + 1].needsUpdate = true
  }

  object.pos.x = objectNewPos.x
  object.pos.y = objectNewPos.y
  object.sync = timer
  world[objectNewPos.x][objectNewPos.y] = object

}

export const swapCells = (world, cell1, cell2, timer) => {
  const oldCell = world[cell1.x][cell1.y]
  world[cell2.x][cell2.y].pos = world[cell1.x][cell1.y].pos
  world[cell2.x][cell2.y].reset()
  world[cell1.x][cell1.y] = world[cell2.x][cell2.y]
  world[cell2.x][cell2.y] = oldCell
  oldCell.pos = cell2
  cell1.sync = timer
  cell2.sync = timer
}

export const getTransparency = (world, direction) => {
}
