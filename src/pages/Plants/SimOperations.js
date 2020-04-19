export const checkCell = (worldSize, currentPos, direction) => {
  let newX = currentPos.x + direction.x
  let newY = currentPos.y + direction.y
  if (newX >=0 && newX < worldSize && newY >= 0 && newY < worldSize) {
    return {x: newX, y: newY}
  }
  return null
}

export const updateWorld = (world, timer, object, objectNewPos) => {
  world[object.pos.x][object.pos.y] = undefined
  object.pos.x = objectNewPos.x
  object.pos.y = objectNewPos.y
  object.sync = timer
  world[objectNewPos.x][objectNewPos.y] = object
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
