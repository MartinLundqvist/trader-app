import {
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useStrategies } from '../../../hooks/useStrategies';
import { useNavigate, useParams } from 'react-router-dom';

const StrategySelector = () => {
  const { strategies, isLoading } = useStrategies();
  let { strategy } = useParams();
  const navigate = useNavigate();

  const handleStrategyChange = (e: SelectChangeEvent) => {
    navigate(`/signals/${e.target.value}`);
  };

  if (isLoading) return <CircularProgress />;

  if (!strategies) return <Alert severity='error'>No strategies found</Alert>;

  if (!strategy) strategy = '';

  return (
    <FormControl>
      <InputLabel id='strategies-label'>Strategy</InputLabel>
      <Select
        labelId='strategies-label'
        id='strategies'
        value={strategy}
        label='Strategy'
        onChange={handleStrategyChange}
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
