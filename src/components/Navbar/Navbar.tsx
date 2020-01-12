import React from 'react'
import './Navbar.css'
import NavbarItem from '../NavbarItem/NavbarItem'
import { Link } from 'react-router-dom'
import logo from '../../bb.png'
import { ThemeContext, themes } from '../../contexts/ThemeContext'

const Navbar: React.FC = () => {
  const [width, setWidth] = React.useState(window.innerWidth)
  const theme = React.useContext(ThemeContext)
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
    <div className='navbar noselect' style={{
      background: theme.theme.navbarBackground,
    }}>
      <div className='left-side'>
        <Link to=''><NavbarItem text='Home'  redirectLocation='' />Home</Link>
        { width > 600 && <Link to='projects'><NavbarItem text='Projects' redirectLocation='projects' /></Link> }
      </div>
      <div className='logo-container' >
        <Link to=''><img src={logo} alt='logo' role='button' height='100%'/></Link>
      </div>
      <div className='right-side'>
        <div className='theme-switcher' role='button' onClick={() => theme.toggleTheme()}>
          {theme.theme === themes.light ? <>&#128262;</> : <>&#127765;</>}
        </div>
        { width <= 600 && <Link to='projects'><NavbarItem text='Projects' redirectLocation='projects' /></Link> }
      </div>
    </div>
   )
}

export default Navbar
