import { create, all } from 'mathjs'
const math = create(all)

export const colliding = (rect1, rect2) => {
  return (
    rect1.pos.x < rect2.pos.x + rect2.width &&
    rect1.pos.x + rect1.width > rect2.pos.x &&
    rect1.pos.y < rect2.pos.y + rect2.height &&
    rect1.pos.y + rect1.height > rect2.pos.y
  )
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
export const lineLine = (line1, line2) => {
  let [x1, x2, y1, y2] = [line1.x1, line1.x2, line1.y1, line1.y2]
  let [x3, x4, y3, y4] = [line2.x1, line2.x2, line2.y1, line2.y2]
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false
  }

  let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1)
  let y = y1 + ua * (y2 - y1)

  return [x, y]
}

export const lineBox = (line, box) => {
  //console.log(line, box)
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
  let up = lineLine(line, {
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
  // remove false values
  let distances = [left, right, up, bottom].filter(t => t)
  if (distances.length === 0) {
    return false
  }
  let lowest = Infinity
  for (let distance of distances) {
    let dist = Math.hypot(line.x1 - distance[0], line.y1 - distance[1])
    if (dist < lowest) {
      lowest = dist
    }
  }
  return lowest
}

export const lineSnake = (line, snake) => {
  for (let segment of snake.segments) {
    if (lineBox(line, segment) && snake.getActive()) {
      return true
    }
  }
}

export const boxSnake = (box, snake) => {
  for (let segment of snake.segments) {
    if (colliding(box, segment) && snake.getActive()) {
      return true
    }
  }
}

export const removeElement = (array, elem) => {
  let index = array.indexOf(elem)
  if (index > -1) {
    array.splice(index, 1)
  }
}
