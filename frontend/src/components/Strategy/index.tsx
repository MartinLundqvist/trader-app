import { Alert, Box, Typography } from '@mui/material';
import { useStrategies } from '../../hooks/useStrategies';
import { TraderPaper } from '../../elements';

const Strategy = (): JSX.Element => {
  const { currentStrategy } = useStrategies();

  if (!currentStrategy) return <Alert severity='info'>Select a strategy</Alert>;

  return (
    <TraderPaper>
      <Box>
        <Typography>Strategy: {currentStrategy.name} </Typography>
        <Typography>
          Description: {currentStrategy.description_long}{' '}
        </Typography>
      </Box>
    </TraderPaper>
  );
};

export default Strategy;
