import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function SimpleContainer({children}: React.PropsWithChildren) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" sx={{height: 100}}>
        {children}
      </Container>
    </React.Fragment>
  );
}