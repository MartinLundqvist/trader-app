import { Jobs } from '@trader/types';
import { CircularProgressWithLabel, TraderCard } from '../../../elements';
import {
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export const JobsCard = ({
  title,
  jobs,
}: {
  title: string;
  jobs: Jobs;
}): JSX.Element => {
  return (
    <TraderCard>
      <CardContent>
        <Typography color='HighlightText' gutterBottom>
          {title}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Added</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Parameters</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job, index) => (
                <TableRow key={job.id + index}>
                  <TableCell>{job.added.toDateString()}</TableCell>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    <CircularProgressWithLabel value={job.progress * 100} />
                  </TableCell>
                  <TableCell>{job.message}</TableCell>
                  <TableCell>{JSON.stringify(job.variables)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </TraderCard>
  );
};
