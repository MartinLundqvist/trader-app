import {
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useTrader } from '../../contexts/TraderContext';
import { useStrategies } from '../../hooks/useStrategies';

const StrategySelector = () => {
  const { strategies, isLoading } = useStrategies();
  const { strategy, setStrategy } = useTrader();

  if (isLoading) return <CircularProgress />;

  if (!strategies) return <Alert severity='error'>No strategies found</Alert>;

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id='strategies-label'>Strategies</InputLabel>
        <Select
          labelId='strategies-label'
          id='strategies'
          value={strategy}
          label='Symbol'
          onChange={(e) => setStrategy(e.target.value)}
        >
          {strategies.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default StrategySelector;
