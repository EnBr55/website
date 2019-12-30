import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Projects from './pages/Projects/Projects'
import Navbar from './components/Navbar/Navbar'
import {ThemeContext, themes} from './contexts/ThemeContext' 

const App: React.FC = () => {
  const theme = {
    theme: themes.dark,
    hi: true,
    toggleTheme: () => {
      console.log(themeState.hi)
      setThemeState({
        ...themeState,
        theme: themeState.theme === themes.light ? themes.dark : themes.light,
        hi: !themeState.hi
      })
    }
  }
  const [themeState, setThemeState] = React.useState(theme)
  return (
    <div className='App'>
      <ThemeContext.Provider value={theme}>
        <Router>
          <div className='header'>
            <Navbar />
          </div>
          <div className='content'>
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route path='/projects'>
                <Projects />
              </Route>
              <Route>
                <div>
                  <h1>404 - Page not Found :(</h1>
                </div>
              </Route>
            </Switch>
          </div>
        </Router>
      </ThemeContext.Provider>
    </div>
  )
}

export default App
