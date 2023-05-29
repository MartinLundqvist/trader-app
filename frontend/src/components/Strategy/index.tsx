import { Alert, Box, Grid, Typography } from '@mui/material';
import { useStrategies } from '../../hooks/useStrategies';
import { TraderPaper } from '../../elements';
import { useParams } from 'react-router-dom';
import Chart from '../Chart';
import Trade from '../Trade';

const Strategy = (): JSX.Element => {
  const { strategies } = useStrategies();
  const { strategy } = useParams();

  const currentStrategy = strategies?.find((s) => s.name === strategy);

  if (!currentStrategy) return <Alert severity='info'>Select a strategy</Alert>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TraderPaper>
          <Box>
            <Typography>Strategy: {currentStrategy.name} </Typography>
            <Typography>
              Description: {currentStrategy.description_long}{' '}
            </Typography>
          </Box>
        </TraderPaper>
      </Grid>
      <Grid item xs={9}>
        <Chart />
      </Grid>
      <Grid item xs={3}>
        <Trade />
      </Grid>
    </Grid>
  );
};

export default Strategy;
