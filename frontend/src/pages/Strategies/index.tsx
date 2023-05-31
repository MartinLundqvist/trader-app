import { Alert, CircularProgress, Grid } from '@mui/material';
import { Strategy } from './Strategy';
import { useStrategies } from '../../hooks/useStrategies';
import { MarketData } from './MarketData';
import { TraderCard, TraderHeader } from '../../elements';
import { useJobs } from '../../hooks/useJobs';

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
    <>
      <TraderHeader title='Refresh market data and strategy signals' />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <MarketData />
        </Grid>
        {strategies.map((s) => (
          <Grid item xs={4} key={s.id}>
            <Strategy strategy={s} />
          </Grid>
        ))}
        <Grid item xs={4}>
          <Jobs />
        </Grid>
      </Grid>
    </>
  );
};

const Jobs = (): JSX.Element => {
  const { data, isLoading, isError, error } = useJobs();

  return (
    <TraderCard>
      <TraderHeader title='Jobs' />
      {isLoading && <CircularProgress />}
      {isError && <Alert severity='error'>Error: {error?.message}</Alert>}
      {data &&
        data.map((job: any) => (
          <div key={job.id}>
            <p>
              {job.name}: {job.status}
            </p>
          </div>
        ))}
    </TraderCard>
  );
};

export default Strategies;
