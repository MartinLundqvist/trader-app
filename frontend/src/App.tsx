import {
  AppBar,
  Box,
  FormControl,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';

import { useStrategies } from './hooks/useStrategies';
import { useState } from 'react';
import IFrame from './components/IFrame';
import Chart from './components/Chart';

const navWidth = 240;

function App() {
  const { strategies } = useStrategies();
  const [symbol, setSymbol] = useState<string>('');
  const [chartURL, setChartURL] = useState<string>('');

  const handleSymbolChange = (symbol: string) => {
    setSymbol(symbol);
    let chart = strategies.find((s) => s.symbol === symbol)?.graph;
    setChartURL(`/src/development_assets/${chart}.html`);
    console.log(symbol);
    console.log(chart);
    console.log(chartURL);
  };

  return (
    <>
      <AppBar
        position='fixed'
        sx={{
          width: `calc(100% - ${navWidth}px)`,
        }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component='nav' sx={{ width: navWidth }}>
        <Toolbar />
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant='h6' noWrap>
            Today's picks
          </Typography>
          <FormControl fullWidth>
            <InputLabel id='todays-picks-label'>Symbol</InputLabel>
            <Select
              labelId='todays-picks-label'
              id='todays-picks'
              value={symbol}
              label='Symbol'
              onChange={(e) => handleSymbolChange(e.target.value)}
            >
              {strategies.map((s) => (
                <MenuItem key={s.symbol} value={s.symbol}>
                  {s.symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </Box>
      <Box position='absolute' sx={{ top: '0', left: navWidth, right: `0` }}>
        <Toolbar />
        <Paper>
          <Typography padding={2} variant='h6' noWrap>
            Chart
          </Typography>
          <Chart />
        </Paper>
      </Box>
    </>
  );
}

export default App;
