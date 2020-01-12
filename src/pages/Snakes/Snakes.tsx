import React from 'react'
import './Snakes.css'
import P5Wrapper from 'react-p5-wrapper'
import { SnakeSim } from './SnakeSim'

const Snakes: React.FC = () => {
  return (
    <div className='snakes'>
      <P5Wrapper sketch={SnakeSim} />
      <p>UI controls are in progress. For now, press space to toggle training.</p>
    </div>
  )
}

export default Snakes
