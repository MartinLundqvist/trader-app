import { Grid } from '@mui/material';
import { TraderHeader } from '../../elements';
import { useJobs } from '../../hooks/useJobs';
import { JobsCard } from './JobsCard';

const Jobs = (): JSX.Element => {
  const { jobs } = useJobs();
  return (
    <>
      <TraderHeader title='Current pending and completed background jobs' />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <JobsCard title='Pending' jobs={jobs ? jobs.pending : []} />
        </Grid>
        <Grid item xs={12}>
          <JobsCard title='Completed' jobs={jobs ? jobs.completed : []} />
        </Grid>
      </Grid>
    </>
  );
};

export default Jobs;
