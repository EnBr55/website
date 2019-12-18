import React from 'react'
import './Navbar.css'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        Home
      </Toolbar>
    </AppBar>
   )
}

export default Navbar
