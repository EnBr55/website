import React from 'react'
import './Navbar.css'
import NavbarItem from '../NavbarItem/NavbarItem'

const Navbar: React.FC = () => {
  return (
    <div className='navbar'>
      <NavbarItem text='HOME' redirectLocation='' />
      <NavbarItem text='hi' redirectLocation='aaa' />
    </div>
   )
}

export default Navbar
