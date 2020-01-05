import React from 'react'
import './Navbar.css'
import NavbarItem from '../NavbarItem/NavbarItem'
import { Redirect } from 'react-router-dom'
import logo from '../../bb.png'
import { ThemeContext, themes } from '../../contexts/ThemeContext'

const Navbar: React.FC = () => {
  const [redirect, setRedirect] = React.useState<string | undefined>(undefined)
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
    <div className='navbar noselect' style={{background: theme.theme.navbarBackground}}>
      {redirect !== undefined && <Redirect to={redirect} />}
      <div className='left-side'>
        <NavbarItem text='Home'  redirectLocation='' setRedirect={setRedirect} />
        { width > 600 && <NavbarItem text='Projects' redirectLocation='projects' setRedirect={setRedirect} /> }
      </div>
      <div className='logo-container' onClick={() => setRedirect('')}>
        <img src={logo} alt='logo' height='100%'/>
      </div>
      <div className='right-side'>
        <div className='theme-switcher' onClick={() => {theme.toggleTheme();console.log(theme.theme)}}>
          {theme.theme === themes.light ? <>&#128262;</> : <>&#127765;</>}
        </div>
        { width <= 600 && <NavbarItem text='Projects' redirectLocation='projects' setRedirect={setRedirect} /> }
      </div>
    </div>
   )
}

export default Navbar
