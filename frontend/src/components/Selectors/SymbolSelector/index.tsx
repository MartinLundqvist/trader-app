import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { StrategySignals } from '@trader/types';

// TODO: This generates an "out of range" warning when the URL based ticker is not part of the filtered symbols.
const SymbolSelector = ({ signals }: { signals: StrategySignals }) => {
  let { strategy, ticker } = useParams();
  const navigate = useNavigate();

  const handleTickerChange = (e: SelectChangeEvent) => {
    navigate(`/signals/${strategy}/${e.target.value}`);
  };

  if (!signals) return <Alert severity='error'>No signals found</Alert>;

  if (!ticker) ticker = '';

  return (
    <FormControl fullWidth size='small'>
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
