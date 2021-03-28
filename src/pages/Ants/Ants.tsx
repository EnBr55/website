import React from 'react'
import './Ants.css'
import P5Wrapper from 'react-p5-wrapper'
import { AntSim } from './AntSim'
import Button from '../../components/Button/Button'

const Ants: React.FC = () => {
  const [showSim, setShowSim] = React.useState(false)
  const [width, setWidth] = React.useState(256)
  const [trailLength, setTrailLength] = React.useState(6)
  const [numAnts, setNumAnts]  = React.useState(6000)
  const [antSpeed, setAntSpeed] = React.useState(1)
  const [antFollowMod, setAntFollowMod] = React.useState(11)
  const [antTurnRate, setAntTurnRate] = React.useState(0.5)
  const [antVisionRange, setAntVisionRange] = React.useState(7)
  return (
    <div className='snakes'>
      {!showSim && <div className='SimSettings'>
          Resolution (px)  [warning: values above 256px not recommended for slower computers]
          <input type='number' step={64} placeholder="256" min={128} value={width} onChange={(e)=>{setWidth(Number(e.target.value))}}/>
          <br/>
          Number of Ants
          <input type='number' placeholder="1" min={1} value={numAnts} onChange={(e)=>{setNumAnts(Number(e.target.value))}}/>
          <br/>
          Trail Length (ant units)
          <input type='number' placeholder="0" min={0} value={trailLength} onChange={(e)=>{setTrailLength(Number(e.target.value))}}/>
          <br/>
          Ant Speed Modifier
          <input type='number' placeholder="2" min={1} value={antSpeed} onChange={(e)=>{setAntSpeed(Number(e.target.value))}}/>
          <br/>
          Ant Influencability (how likely they are to follow a true)
          <input type='number' placeholder="4" min={0} value={antFollowMod} onChange={(e)=>{setAntFollowMod(Number(e.target.value))}}/>
          <br/>
          Ant Turn Rate
          <input type='number' placeholder="0.5" min={0} value={antTurnRate} onChange={(e)=>{setAntTurnRate(Number(e.target.value))}}/>
          <br/>
          Ant Vision Range (how far ahead an ant looks)
          <input type='number' placeholder="4" min={1} value={antVisionRange} onChange={(e)=>{setAntVisionRange(Number(e.target.value))}}/>
          <br/>
        <Button text='Start' click={() => setShowSim(true)}/>
      </div>}
      {showSim && <><P5Wrapper style={{width: '50%'}}
      sketch={AntSim}
      width={width}
      trailLength={trailLength}
      numAnts={numAnts}
      antSpeed={antSpeed}
      antFollowMod={antFollowMod}
      antTurnRate={antTurnRate}
      antVisionRange={antVisionRange}
          />
      <Button text='Back' click={() => setShowSim(false)}/>
          </>}
    </div>
  )
}

export default Ants
