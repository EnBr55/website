import React from 'react'
import './NavbarItem.css'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'

type props = {
  text: string,
  redirectLocation: string
  setRedirect(location: string): void
}

const NavbarItem: React.FC<props> = ({text, redirectLocation, setRedirect}) => {
  return (
    <div className='navbar-item noselect' onClick={() => setRedirect(redirectLocation)}>
      <div className='navbar-item-content'>
        {text}
      </div>
    </div>
  )
}

export default NavbarItem
