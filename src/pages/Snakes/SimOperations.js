export const colliding = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  ) 
}

export const lineLine = (line1, line2) => {
  let uA =
    ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
      (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
    ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
      (line2.x2 - line2.x1) * (line1.y2 - line1.y1))
  let uB =
    ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
      (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
    ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
      (line2.x2 - line2.x1) * (line1.y2 - line1.y1))
  return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
}

export const lineBox = (line, box) => {
  let left = lineLine(line, {
    x1: box.x,
    y1: box.y,
    x2: box.x,
    y2: box.y + box.height,
  })
  let right = lineLine(line, {
    x1: box.x + box.width,
    y1: box.y,
    x2: box.x + box.width,
    y2: box.y + box.height,
  })
  let top = lineLine(line, {
    x1: box.x,
    y1: box.y,
    x2: box.x + box.width,
    y2: box.y,
  })
  let bottom = lineLine(line, {
    x1: box.x,
    y1: box.y + box.height,
    x2: box.x + box.width,
    y2: box.y + box.height,
  })
  return (left || right || top || bottom)
}

export const lineSnake = (line, snake) => {
  for (let segment of snake.segments) {
    if (lineBox(line, segment) && snake.getAlive()) { return true }
  }
}

export const boxSnake = (box, snake) => {
  for (let segment of snake.segments) {
    if (colliding(box, segment) && snake.getAlive()) { return true }
  }
}
