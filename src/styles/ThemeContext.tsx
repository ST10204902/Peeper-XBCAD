import React, { createContext, useState, useContext, ReactNode } from 'react';

export const lightTheme = {
  background: '#F9F9F9',
  text: '#161616',
  primary: '#334FD7',
  secondary: '#A4DB51',

//Colour Palette
purple: '#C8B0FF',
oliveGreen: '#8EAB48',
yellow: '#FCDE39',
orange: '#FE7143',
lightBlue: '#D9E7FF',
darkGreen: '#466D57',
red: '#EA4B4B',
brightGreen: '#A4DB51',
electricBlue: '#334FD7',

//Login and Register
  loginBackground: '#A4DB51',
  registerBackground: '#334F07',
  loginInput: '#F9F9F9',
  registerInput: '#F9F9F9',
};

export const darkTheme = {
  background: '#161616',
  text: '#F9F9F9',
  primary: '#1E1E1E',
  secondary: '#333333',

  //Colour Palette
purple: '#C8B0FF',
oliveGreen: '#8EAB48',
yellow: '#FCDE39',
orange: '#FE7143',
lightBlue: '#D9E7FF',
darkGreen: '#466D57',
red: '#EA4B4B',
brightGreen: '#A4DB51',
electricBlue: '#334FD7',

  //Login and Register
  loginBackground: '#161616',
  registerBackground: '#161616',
  loginInput: '#A4DB51',
  registerInput: '#334F07',
  // Add other colors as needed
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);