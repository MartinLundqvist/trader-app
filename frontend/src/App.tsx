import { AppBar, Container, Grid, Toolbar, Typography } from '@mui/material';

import Chart from './components/Chart';
import Trade from './components/Trade';
import Strategy from './components/Strategy';
import Selectors from './components/Selectors';

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
          </Grid>
          <Grid item xs={2}>
            <Selectors />
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Strategy />
              </Grid>
              <Grid item xs={8}>
                <Chart />
              </Grid>
              <Grid item xs={4}>
                <Trade />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
