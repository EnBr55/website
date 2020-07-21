import React from 'react'
import './Plants.css'
import P5Wrapper from 'react-p5-wrapper'
import { PlantSim } from './PlantSim'
import Button from '../../components/Button/Button'

//<Button text='Toggle Training' click={() => setSimSpeed(simSpeed === 1 ? 40 : 1)}/>

const Plants: React.FC = () => {
  const [simSpeed, setSimSpeed] = React.useState(1)
  const [cellType, setCellType] = React.useState('sand')
  return (
    <div className='snakes'>
      <P5Wrapper sketch={PlantSim} simSpeed={simSpeed} cellType={cellType}/>
      <div className='controls' >
        <Button text='Dirt' click={() => setCellType('sand')}/>
        <Button text='Water' click={() => setCellType('water')}/>
        <Button text='Vapor' click={() => setCellType('steam')}/>
      </div>
      <div className='controls' >
        <Button text='Root' click={() => setCellType('root')}/>
        <Button text='Plant' click={() => setCellType('plant')}/>
        <Button text='Debug' click={() => setCellType('debug')}/>
      </div>
    </div>
  )
}

export default Plants
