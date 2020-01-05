import React from 'react'

export const themes = {
  light: {
    background: '#ffffff',
    color: '#512119'
  },
  dark: {
    background: '#000000',
    color: 'ffffff'
  }
}

export const ThemeContext = React.createContext({
  theme: themes.light,
  toggleTheme: () => {}
})
