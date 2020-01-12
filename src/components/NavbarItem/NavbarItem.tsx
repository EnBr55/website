import React from 'react'
import './NavbarItem.css'

type props = {
  text: string,
  redirectLocation: string,
}

const NavbarItem: React.FC<props> = ({text, redirectLocation}) => {
  return (
    <div className='navbar-item' role='button' >
      <div className='navbar-item-content'>
        {text}
      </div>
    </div>
  )
}

export default NavbarItem
