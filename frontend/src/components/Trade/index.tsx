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
import { TraderPaper } from '../../elements';
import { useEffect } from 'react';
import { useTrades } from '../../contexts/TradesContext';
import { useParams } from 'react-router-dom';
import { Trade as TradeType } from '@trader/types';

const Trade = (): JSX.Element => {
  const { currentSignal, isLoading, error } = useSignals();
  const { ticker } = useParams();
  const {
    getTrade,
    addTrade,
    updateTrade,
    tradeExists,
    currentTrade,
    setCurrentTrade,
  } = useTrades();

  useEffect(() => {
    handleResetTrade();
  }, [currentSignal]);

  const handleResetTrade = () => {
    if (!currentSignal) return;
    // If we have a trade for this symbol already, use that one.
    const trade = getTrade(currentSignal.symbol);
    if (!trade) {
      setCurrentTrade({
        side: currentSignal.signal === 'buy' ? 'buy' : 'sell',
        qty: 0,
        stop_loss: Number(Number(currentSignal.stop_loss).toFixed(2)),
        take_profit: Number(Number(currentSignal.take_profit).toFixed(2)),
        limit: currentSignal.limit,
        symbol: currentSignal.symbol,
      });
      return;
    }

    setCurrentTrade(trade);
  };

  const handleCurrentTradeChange = (key: keyof TradeType, value: any) => {
    if (!currentTrade) return;
    setCurrentTrade((prev) => ({ ...prev, [key]: value }));
  };

  const handleManageTrade = () => {
    if (tradeExists(currentTrade.symbol)) {
      updateTrade(currentTrade.symbol, currentTrade);
    } else {
      addTrade(currentTrade);
    }
  };

  if (!ticker || ticker === '')
    return <Alert severity='info'>Select a ticker</Alert>;

  if (isLoading) return <CircularProgress />;

  if (error) return <Alert severity='error'>Error: {error.message}</Alert>;

  if (!currentSignal)
    return <Alert severity='error'>No signal found for {ticker}</Alert>;

  if (!currentTrade)
    return <Alert severity='error'>No trade yet defined for{ticker}</Alert>;

  return (
    <TraderPaper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ gap: '1rem' }}>
            <Typography>
              {currentSignal.signal} symbol {currentSignal.symbol} on{' '}
              {currentSignal.date.toDateString()}
            </Typography>
            <Select
              value={currentTrade.side}
              onChange={(evt) =>
                handleCurrentTradeChange('side', evt.target.value)
              }
            >
              <MenuItem value='buy'>Buy</MenuItem>
              <MenuItem value='sell'>Sell</MenuItem>
            </Select>
            <TextField
              type='number'
              label='Quantity'
              value={currentTrade.qty}
              onChange={(evt) =>
                handleCurrentTradeChange('qty', Number(evt.target.value))
              }
            />
            <TextField
              type='number'
              label='Latest price'
              value={currentTrade.limit}
              disabled
            />
            <TextField
              type='number'
              label='Take Profit'
              value={currentTrade.take_profit}
              onChange={(evt) =>
                handleCurrentTradeChange(
                  'take_profit',
                  Number(evt.target.value)
                )
              }
            />
            <TextField
              type='number'
              label='Stop Loss'
              value={currentTrade.stop_loss}
              onChange={(evt) =>
                handleCurrentTradeChange('stop_loss', Number(evt.target.value))
              }
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
              <Button
                variant='contained'
                color='primary'
                onClick={handleManageTrade}
              >
                {tradeExists(currentTrade.symbol) ? 'Update' : 'Place'}
              </Button>
            </Box>
          </FormControl>
        </Grid>
      </Grid>
    </TraderPaper>
  );
};

export default Trade;
