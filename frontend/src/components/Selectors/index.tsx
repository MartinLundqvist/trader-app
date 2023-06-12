import { Box, Divider, Stack } from '@mui/material';
import StrategySelector from './StrategySelector';
import SymbolSelector from './SymbolSelector';
import FilterSelector from './FilterSelector';
import { useEffect, useMemo, useState } from 'react';
import { StrategySignals } from '@trader/types';
import { useSignals } from '../../hooks/useSignals';

export type Filter = 'All' | 'Buy' | 'Sell';

const Selectors = (): JSX.Element => {
  const [filter, setFilter] = useState<Filter>('All');
  const { signals, isLoading } = useSignals();

  const filteredSignals = useMemo(() => {
    if (!signals) return [];

    if (filter === 'All') return signals;

    return signals.filter((s) => s.signal === filter);
  }, [signals, filter]);

  const handleChangeFilter = (newFilter: Filter) => setFilter(newFilter);

  return (
    <Box
      padding={1}
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        minWidth: '40%',
      }}
    >
      <StrategySelector />
      <FilterSelector filter={filter} setFilter={handleChangeFilter} />
      <SymbolSelector signals={filteredSignals} />
    </Box>
  );
};

export default Selectors;
