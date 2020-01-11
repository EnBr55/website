export const colliding = (rect1, rect2) => {
  return (
    rect1.pos.x < rect2.pos.x + rect2.width &&
    rect1.pos.x + rect1.width > rect2.pos.x &&
    rect1.pos.y < rect2.pos.y + rect2.height &&
    rect1.pos.y + rect1.height > rect2.pos.y
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
    x1: box.pos.x,
    y1: box.pos.y,
    x2: box.pos.x,
    y2: box.pos.y + box.height,
  })
  let right = lineLine(line, {
    x1: box.pos.x + box.width,
    y1: box.pos.y,
    x2: box.pos.x + box.width,
    y2: box.pos.y + box.height,
  })
  let top = lineLine(line, {
    x1: box.pos.x,
    y1: box.pos.y,
    x2: box.pos.x + box.width,
    y2: box.pos.y,
  })
  let bottom = lineLine(line, {
    x1: box.pos.x,
    y1: box.pos.y + box.height,
    x2: box.pos.x + box.width,
    y2: box.pos.y + box.height,
  })
  return (left || right || top || bottom)
}

export const lineSnake = (line, snake) => {
  for (let segment of snake.segments) {
    if (lineBox(line, segment) && snake.getActive()) { return true }
  }
}

export const boxSnake = (box, snake) => {
  for (let segment of snake.segments) {
    if (colliding(box, segment) && snake.getActive()) { return true }
  }
}

export const removeElement = (array, elem) => {  
    let index = array.indexOf(elem)
    if (index > -1) {
        array.splice(index, 1)
    }
  }
