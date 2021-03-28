export const isOutOfBounds = (point, windowDimensions) => {
  return (
    point.x < 0 || point.x > windowDimensions.width ||
    point.y < 0 || point.y > windowDimensions.height
  )
}
