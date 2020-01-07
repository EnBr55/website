import React from 'react'
import './Snakes.css'
import P5Wrapper from 'react-p5-wrapper'
import { SnakeSim } from './SnakeSim'

const Snakes: React.FC = () => {
  return (
    <div className='snakes'>
      <P5Wrapper sketch={SnakeSim} />
    </div>
  )
}

export default Snakes
