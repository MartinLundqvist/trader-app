import { Stack } from '@mui/material';
import StrategySelector from './StrategySelector';
import SymbolSelector from './SymbolSelector';

const Selectors = (): JSX.Element => {
  return (
    <Stack gap='1rem'>
      <StrategySelector />
      <SymbolSelector />
    </Stack>
  );
};

export default Selectors;
