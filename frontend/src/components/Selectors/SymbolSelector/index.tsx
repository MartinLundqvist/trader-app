import {
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useSignals } from '../../../hooks/useSignals';
import { useNavigate, useParams } from 'react-router-dom';

const SymbolSelector = () => {
  const { signals, isLoading } = useSignals();
  let { strategy, ticker } = useParams();
  const navigate = useNavigate();

  const handleTickerChange = (e: SelectChangeEvent) => {
    navigate(`/signals/${strategy}/${e.target.value}`);
  };

  if (!strategy) return <Alert severity='info'>Select a strategy</Alert>;

  if (isLoading) return <CircularProgress />;

  if (!signals) return <Alert severity='error'>No signals found</Alert>;

  if (!ticker) ticker = '';

  return (
    <FormControl>
      <InputLabel id='todays-picks-label'>Symbol</InputLabel>
      <Select
        labelId='todays-picks-label'
        id='todays-picks'
        value={ticker}
        label='Symbol'
        onChange={handleTickerChange}
      >
        {signals.map((s) => (
          <MenuItem key={s.symbol} value={s.symbol}>
            {s.symbol}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SymbolSelector;
