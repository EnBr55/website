import React from 'react'
import './Navbar.css'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [redirect, setRedirect] = React.useState('')
  return (
    <div>
      <AppBar position="static">
        <Router>
          {redirect && <Redirect to={redirect} />}
        </Router>
        <Toolbar>
          <Button onClick={() => setRedirect('/')}>Home</Button>
          <div style={{backgroundColor: 'red', right: 100, width: '100px', height: '100%'}}>
          </div>
        </Toolbar>
      </AppBar>
      <div style={{height: '4em', backgroundColor: 'pink', width: '100%'}}>
        <div className="navbar-item">
          hi
        </div>
      </div>
    </div>
   )
}

export default Navbar
