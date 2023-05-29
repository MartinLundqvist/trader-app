import {
  AppBar,
  Container,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';

import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

function App() {
  return (
    <>
      <Container maxWidth='xl'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar position='relative'>
              <Toolbar>
                <Typography variant='h6'>Trader</Typography>
              </Toolbar>
            </AppBar>
            <Navigation />
            <Divider sx={{ marginBottom: '1rem' }} />
          </Grid>
        </Grid>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
