"use client"

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

import MuiAutocomplete from "../components/components/MuiAutocomplete";


export default function Test() {
  return <ThemeProvider theme={darkTheme}>
    <CssBaseline />

    <MuiAutocomplete id="text" data="hola,mundo,test" placeholder="Salutions"></MuiAutocomplete>
    
  </ThemeProvider>
}