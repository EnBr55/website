import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Projects from './pages/Projects/Projects'
import Navbar from './components/Navbar/Navbar'
import {ThemeContext, themes} from './contexts/ThemeContext' 

const App: React.FC = () => {
  const [themeState, setThemeState] = React.useState({
    theme: themes.light,
    toggleTheme: () => {
      // we use the second form of setState (passing a function)
      //   so as to force the state updated to be received synchronously
      setThemeState(themeState => ({
        ...themeState,
        theme: themeState.theme === themes.light ? themes.dark : themes.light,
      }))
    }
  })
  return (
    <div className='App'>
      <ThemeContext.Provider value={themeState}>
        <Router>
          <div className='header'>
            <Navbar />
          </div>
            <div className='content' style={{
              backgroundColor: themeState.theme.background,
              color: themeState.theme.color
            }}>
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
