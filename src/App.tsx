import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'

const App: React.FC = () => {
  return (
    <div className="App">
			<Navbar />
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route>
            <div>
              <h1>404 - Page not Found :(</h1>
              <a href={'https://benbraham.com'}>Go home</a>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
