import { Box, Divider, Stack } from '@mui/material';
import StrategySelector from './StrategySelector';
import SymbolSelector from './SymbolSelector';

const Selectors = (): JSX.Element => {
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
      <SymbolSelector />
    </Box>
  );
};

export default Selectors;
