import React from 'react'
import './NavbarItem.css'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'

type props = {
  text: string,
  redirectLocation: string
}

const NavbarItem: React.FC<props> = ({text, redirectLocation}) => {
  const [redirect, setRedirect] = React.useState<string | undefined>(undefined)
  return (
    <div className='navbar-item noselect' onClick={() => setRedirect(redirectLocation)}>
      {redirect !== undefined && <Redirect to={redirect} />}
    {text}
    </div>
  )
}

export default NavbarItem
