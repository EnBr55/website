import React from 'react'
import './Navbar.css'
import NavbarItem from '../NavbarItem/NavbarItem'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
import logo from '../../bb.png'

const Navbar: React.FC = () => {
  const [redirect, setRedirect] = React.useState<string | undefined>(undefined)
  return (
    <div className='navbar'>
      {redirect !== undefined && <Redirect to={redirect} />}
      <NavbarItem text='Home' redirectLocation='' setRedirect={setRedirect} />
      <NavbarItem text='Projects' redirectLocation='projects' setRedirect={setRedirect} />
        <div className='logo-container' onClick={() => setRedirect('')}>
        <img src={logo} alt='logo' height='100%'/>
      </div>
    </div>
   )
}

export default Navbar
