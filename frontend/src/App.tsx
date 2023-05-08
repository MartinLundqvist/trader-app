import {
  AppBar,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';

import Chart from './components/Chart';
import Trade from './components/Trade';
import Strategy from './components/Strategy';
import Selectors from './components/Selectors';
import Signals from './pages/Signals';
import { SyntheticEvent, useState } from 'react';

function App() {
  const [tab, setTab] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setTab(newValue);
  };

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
            <Tabs value={tab} onChange={handleChange}>
              <Tab label='Strategies' value={0} />
              <Tab label='Signals' value={1} />
            </Tabs>
            <Divider sx={{ marginBottom: '1rem' }} />
          </Grid>
        </Grid>
        {tab === 0 && <div>Not implemented</div>}
        {tab === 1 && <Signals />}
      </Container>
    </>
  );
}

export default App;
