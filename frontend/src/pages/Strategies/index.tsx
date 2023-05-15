import { Alert, CircularProgress, Grid } from '@mui/material';
import { Strategy } from './Strategy';
import { useStrategies } from '../../hooks/useStrategies';
import { MarketData } from './MarketData';

const Strategies = (): JSX.Element => {
  const {
    strategies,
    isLoading: isLoadingStrategies,
    error: errorStrategies,
  } = useStrategies();

  if (isLoadingStrategies) return <CircularProgress />;

  if (errorStrategies)
    return <Alert severity='error'>Error: {errorStrategies.message}</Alert>;

  if (!strategies) return <Alert severity='warning'>No strategies found</Alert>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <MarketData />
      </Grid>
      {strategies.map((s) => (
        <Grid item xs={4} key={s.id}>
          <Strategy strategy={s} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Strategies;
