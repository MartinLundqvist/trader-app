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
import { useParams } from 'react-router-dom';
import { Filter } from '..';

const filters: Filter[] = ['All', 'Buy', 'Sell'];

const FilterSelector = ({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}) => {
  // const { signals, setFilter, filter, isLoading } = useSignals();
  // const { strategy } = useParams();

  const handleFilterChange = (e: SelectChangeEvent) => {
    // if (!signals) return;
    setFilter(e.target.value as Filter);
  };

  // if (!strategy) return null;

  // if (isLoading) return <CircularProgress />;

  // if (!signals) return <Alert severity='error'>No signals found</Alert>;

  return (
    <FormControl fullWidth size='small'>
      <InputLabel id='filter-label'>Side</InputLabel>
      <Select
        labelId='filter-label'
        id='filter'
        value={filter}
        label='Side'
        onChange={handleFilterChange}
      >
        {filters.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelector;
