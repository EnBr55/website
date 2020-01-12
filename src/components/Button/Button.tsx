import React from 'react'
import './Button.css'
import { ThemeContext } from '../../contexts/ThemeContext'

type props = {
  text: string,
}

const NavbarItem: React.FC<props> = ({text}) => {
  const theme = React.useContext(ThemeContext).theme
  return (
    <div className='button' role='button' style={{ background: theme.buttonBackground }} >
      <div className='button-content'>
        {text}
      </div>
    </div>
  )
}

export default NavbarItem
