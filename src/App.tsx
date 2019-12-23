import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'

const App: React.FC = () => {
  return (
    <div className='App'>
      <Router>
        <div className='header'>
          <Navbar />
        </div>
        <div className='content'>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route>
              <div>
                <h1>404 - Page not Found :(</h1>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
