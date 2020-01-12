import React from 'react'
import './Snakes.css'
import P5Wrapper from 'react-p5-wrapper'
import { SnakeSim } from './SnakeSim'
import Button from '../../components/Button/Button'

const Snakes: React.FC = () => {
  return (
    <div className='snakes'>
      <P5Wrapper sketch={SnakeSim} />
      <div className='controls'>
        <Button text='Toggle Eyes' />
        <Button text='Toggle Training' />
      </div>
    </div>
  )
}

export default Snakes
