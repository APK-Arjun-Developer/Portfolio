import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#64ffda' },
    secondary: { main: '#bd34fe' },
    background: { default: '#0a192f', paper: '#112240' },
    text: { primary: '#ccd6f6', secondary: '#8892b0' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
});

export default theme;
