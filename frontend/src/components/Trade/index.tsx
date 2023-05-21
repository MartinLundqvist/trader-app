import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useSignals } from '../../hooks/useSignals';
import { useTrader } from '../../contexts/TraderContext';
import { TraderPaper } from '../../elements';
import { useEffect } from 'react';

const Trade = (): JSX.Element => {
  const {
    ticker,
    currentTrade,
    setCurrentTradeQty,
    setCurrentTradeSL,
    setCurrentTradeSide,
    setCurrentTradeTP,
  } = useTrader();
  const { currentSignal, isLoading, error } = useSignals();

  useEffect(() => {
    handleResetTrade();
  }, [currentSignal]);

  const handleResetTrade = () => {
    if (!currentSignal) return;
    setCurrentTradeQty(0);
    setCurrentTradeSide(currentSignal.signal === 'buy' ? 'buy' : 'sell');
    setCurrentTradeTP(currentSignal.take_profit || 0);
    setCurrentTradeSL(currentSignal.stop_loss || 0);
  };

  if (ticker === '') return <Alert severity='info'>Select a ticker</Alert>;

  if (isLoading) return <CircularProgress />;

  if (error) return <Alert severity='error'>Error: {error.message}</Alert>;

  if (!currentSignal)
    return <Alert severity='error'>No signal found for {ticker}</Alert>;

  return (
    <TraderPaper>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth sx={{ gap: '1rem' }}>
            <Typography>
              {currentSignal.signal} symbol {currentSignal.symbol} on{' '}
              {currentSignal.date.toDateString()}
            </Typography>
            <Select
              value={currentTrade.side}
              onChange={(evt) => setCurrentTradeSide(evt.target.value)}
            >
              <MenuItem value='buy'>Buy</MenuItem>
              <MenuItem value='sell'>Sell</MenuItem>
            </Select>
            <TextField
              type='number'
              label='Quantity'
              value={currentTrade.qty}
              onChange={(evt) => setCurrentTradeQty(Number(evt.target.value))}
            />
            <TextField
              type='number'
              label='Latest price'
              value={currentSignal.limit}
              disabled
            />
            <TextField
              type='number'
              label='Take Profit'
              value={currentTrade.take_profit.limit_price}
              onChange={(evt) => setCurrentTradeTP(Number(evt.target.value))}
            />
            <TextField
              type='number'
              label='Stop Loss'
              value={currentTrade.stop_loss.stop_price}
              onChange={(evt) => setCurrentTradeSL(Number(evt.target.value))}
            />
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant='contained'
                color='warning'
                onClick={handleResetTrade}
              >
                Reset
              </Button>
              <Button variant='contained' color='primary'>
                Place
              </Button>
            </Box>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Typography>Summary</Typography>
          <Divider />
          <Typography>Side: {currentTrade.side}</Typography>
          <Typography>
            Max profit:{' '}
            {currentTrade.qty * currentTrade.take_profit.limit_price}
          </Typography>
        </Grid>
      </Grid>
    </TraderPaper>
  );
};

export default Trade;
