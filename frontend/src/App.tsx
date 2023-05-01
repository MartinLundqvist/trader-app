import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import Chart from './components/Chart';
import SymbolSelector from './components/SymbolSelector';
import StrategySelector from './components/StrategySelector';

const navWidth = 240;

function App() {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            Trader
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component='nav' sx={{ width: navWidth }}>
        <Toolbar />
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='h6'>Select strategy</Typography>
          <StrategySelector />
          <Typography variant='h6'>Select symbol</Typography>
          <SymbolSelector />
        </Toolbar>
      </Box>
      <Box position='absolute' sx={{ top: '0', left: navWidth, right: `0` }}>
        <Toolbar />
        <Chart />
      </Box>
    </>
  );
}

export default App;
