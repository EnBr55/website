import React from 'react'
import './Navbar.css'
import NavbarItem from '../NavbarItem/NavbarItem'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
import logo from '../../bb.png'

const Navbar: React.FC = () => {
  const [redirect, setRedirect] = React.useState<string | undefined>(undefined)
  const [width, setWidth] = React.useState(window.innerWidth)
  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
  return (
    <div className='navbar'>
      {redirect !== undefined && <Redirect to={redirect} />}
      <div className='left-side'>
        <NavbarItem text='Home'  redirectLocation='' setRedirect={setRedirect} />
        { width > 600 && <NavbarItem text='Projects' redirectLocation='projects' setRedirect={setRedirect} /> }
      </div>
      <div className='logo-container' onClick={() => setRedirect('')}>
        <img src={logo} alt='logo' height='100%'/>
      </div>
      <div className='right-side'>
        { width <= 600 && <NavbarItem text='Projects' redirectLocation='projects' setRedirect={setRedirect} /> }
      </div>
    </div>
   )
}

export default Navbar
