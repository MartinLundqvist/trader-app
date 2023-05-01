import {
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useSignals } from '../../hooks/useSignals';
import { useTrader } from '../../contexts/TraderContext';

const SymbolSelector = () => {
  const { signals, isLoading } = useSignals();
  const { strategy, ticker, setTicker } = useTrader();

  if (!strategy) return <Alert severity='info'>Select a strategy</Alert>;

  if (isLoading) return <CircularProgress />;

  if (!signals) return <Alert severity='error'>No signals found</Alert>;

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id='todays-picks-label'>Symbol</InputLabel>
        <Select
          labelId='todays-picks-label'
          id='todays-picks'
          value={ticker}
          label='Symbol'
          onChange={(e) => setTicker(e.target.value)}
        >
          {signals.map((s) => (
            <MenuItem key={s.symbol} value={s.symbol}>
              {s.symbol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default SymbolSelector;
