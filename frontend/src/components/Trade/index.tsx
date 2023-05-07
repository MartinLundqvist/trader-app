import {
  Alert,
  CircularProgress,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { useSignals } from '../../hooks/useSignals';
import { useTrader } from '../../contexts/TraderContext';
import { TraderPaper } from '../../elements';

const Trade = (): JSX.Element => {
  const { ticker, currentTrade } = useTrader();
  const { currentSignal, isLoading, error } = useSignals();

  if (ticker === '') return <Alert severity='info'>Select a ticker</Alert>;

  if (isLoading) return <CircularProgress />;

  if (error) return <Alert severity='error'>Error: {error.message}</Alert>;

  if (!currentSignal)
    return <Alert severity='error'>No signal found for {ticker}</Alert>;

  return (
    <TraderPaper>
      <FormControl fullWidth sx={{ gap: '1rem' }}>
        <Typography>
          {currentSignal.signal} symbol {currentSignal.symbol} on{' '}
          {currentSignal.date.toDateString()}
        </Typography>
        <TextField
          type='number'
          label='Take Profit'
          value={
            currentTrade.take_profit > 0
              ? currentTrade.take_profit
              : currentSignal.take_profit
          }
        />
        <TextField
          type='number'
          label='Stop Loss'
          value={
            currentTrade.stop_loss > 0
              ? currentTrade.stop_loss
              : currentSignal.stop_loss
          }
        />
      </FormControl>
    </TraderPaper>
  );
};

export default Trade;
