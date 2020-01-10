export const colliding = (rect1, rect2) => {
  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  ) {
    return true
  }
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
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true
  }
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
  if (left || right || top || bottom) {
    return true
  }
}
