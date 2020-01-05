import React from 'react'

export const themes = {
  light: {
    background: '#ffffff',
    color: '#512119',
    navbarBackground: 'linear-gradient(270deg, rgba(227,204,204,1) 0%, rgba(168,84,168,1) 51%)'
  },
  dark: {
    background: '#000000',
    color: '#ffffff',
    navbarBackground: 'linear-gradient(270deg, rgba(227,204,204,1) 0%, rgba(39,6,45,1) 51%)' 
  }
}

export const ThemeContext = React.createContext({
  theme: themes.light,
  toggleTheme: () => {}
})
