import React from 'react'
import './Button.css'
import { ThemeContext } from '../../contexts/ThemeContext'

type props = {
  text: string
  click?(): void
}

const NavbarItem: React.FC<props> = ({ text, click }) => {
  const theme = React.useContext(ThemeContext).theme
  return (
    <div
      className="button"
      role="button"
      onClick={() => click && click()}
      style={{ background: theme.buttonBackground }}
    >
      <div className="button-content">{text}</div>
    </div>
  )
}

export default NavbarItem
