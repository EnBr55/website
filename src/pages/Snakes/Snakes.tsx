import React from 'react'
import './Snakes.css'
import P5Wrapper from 'react-p5-wrapper'
import { SnakeSim } from './SnakeSim'
import Button from '../../components/Button/Button'

const Snakes: React.FC = () => {
  const [showEyes, setShowEyes] = React.useState(false)
  const [simSpeed, setSimSpeed] = React.useState(1)
  return (
    <div className='snakes'>
      <P5Wrapper sketch={SnakeSim} showEyes={showEyes} simSpeed={simSpeed}/>
      <div className='controls' >
        <Button text='Toggle Eyes' click={() => setShowEyes(!showEyes)}/>
        <Button text='Toggle Training' click={() => setSimSpeed(simSpeed === 1 ? 40 : 1)}/>
      </div>
    </div>
  )
}

export default Snakes
