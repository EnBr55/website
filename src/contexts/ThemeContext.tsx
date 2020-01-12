import React from 'react'

export const themes = {
  light: {
    background: '#ffffff',
    color: '#512119',
    navbarBackground: 'linear-gradient(270deg, rgba(227,204,204,1) 0%, rgba(168,84,168,1) 51%)',
    buttonBackground: 'linear-gradient(0deg, rgba(226,205,223,1) 0%, rgba(215,211,211,1) 100%)'
  },
  dark: {
    background: '#000000',
    color: '#ffffff',
    navbarBackground: 'linear-gradient(270deg, rgba(87,54,54,1) 0%, rgba(39,6,45,1) 51%)',
    buttonBackground: 'linear-gradient(0deg, rgba(89,87,85,1) 0%, rgba(88,72,94,1) 100%)'
  }
}

export const ThemeContext = React.createContext({
  theme: themes.light,
  toggleTheme: () => {}
})
