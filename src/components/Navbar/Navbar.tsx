import React from 'react'
import './Navbar.css'
import NavbarItem from '../NavbarItem/NavbarItem'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [redirect, setRedirect] = React.useState<string | undefined>(undefined)
  return (
    <div className='navbar'>
      {redirect !== undefined && <Redirect to={redirect} />}
      <NavbarItem text='Home' redirectLocation='' setRedirect={setRedirect} />
      <NavbarItem text='Projects' redirectLocation='projects' setRedirect={setRedirect} />
    </div>
   )
}

export default Navbar
