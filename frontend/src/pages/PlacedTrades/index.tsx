import {
  Alert,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { TraderHeader, TraderPaper } from '../../elements';
import { usePlacedTradeJobs } from '../../hooks/usePlacedTradeJobs';
import { JobRow } from './JobRow';

const PlacedTrades = (): JSX.Element => {
  const { placedTradeJobs, isLoading, error } = usePlacedTradeJobs();

  //TODO: Debug
  // console.log(placedTradeJobs);

  return (
    <>
      <TraderHeader title='Manage trades' />
      <Grid container spacing={2}>
        {isLoading && <CircularProgress />}
        {error && <Alert severity='error'>{error.message}</Alert>}
        <TableContainer component={TraderPaper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Job created</TableCell>
                <TableCell># Trades placed</TableCell>
                <TableCell># Successul</TableCell>
                <TableCell># Failed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {placedTradeJobs &&
                placedTradeJobs.map((job) => (
                  <JobRow key={job.job_id} job={job} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default PlacedTrades;
