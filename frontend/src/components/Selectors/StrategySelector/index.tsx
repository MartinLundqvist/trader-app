import {
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useTrader } from '../../../contexts/TraderContext';
import { useStrategies } from '../../../hooks/useStrategies';

const StrategySelector = () => {
  const { strategies, isLoading } = useStrategies();
  const { strategy, setStrategy } = useTrader();

  if (isLoading) return <CircularProgress />;

  if (!strategies) return <Alert severity='error'>No strategies found</Alert>;

  return (
    <FormControl>
      <InputLabel id='strategies-label'>Strategy</InputLabel>
      <Select
        labelId='strategies-label'
        id='strategies'
        value={strategy}
        label='Strategy'
        onChange={(e) => setStrategy(e.target.value)}
      >
        {strategies.map((s) => (
          <MenuItem key={s.id} value={s.name}>
            {s.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StrategySelector;
