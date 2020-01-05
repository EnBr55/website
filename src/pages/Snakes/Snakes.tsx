import React from 'react'
import './Snakes.css'
import P5Wrapper from 'react-p5-wrapper'
import { SnakeSketch } from './SnakeSketch'

const Snakes: React.FC = () => {
  return (
    <div className='snakes'>
      <P5Wrapper sketch={SnakeSketch} />
    </div>
  )
}

export default Snakes
