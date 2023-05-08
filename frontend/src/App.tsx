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

import Signals from './pages/Signals';
import { SyntheticEvent, useState } from 'react';
import Strategies from './pages/Strategies';

function App() {
  const [tab, setTab] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
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
        {tab === 0 && <Strategies />}
        {tab === 1 && <Signals />}
      </Container>
    </>
  );
}

export default App;
