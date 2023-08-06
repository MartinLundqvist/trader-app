import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useState } from 'react';
import { PlacedTradeJob } from '../../hooks/usePlacedTradeJobs';
import { TradeRow } from './TradeRow';

export const JobRow = ({ job }: { job: PlacedTradeJob }): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{job.placed_at?.toLocaleString()}</TableCell>
        <TableCell>
          <Chip label={job.nrTrades} color='primary' size='small'></Chip>
        </TableCell>
        <TableCell>
          <Chip label={job.nrSuccessful} color='success' size='small'></Chip>
        </TableCell>
        <TableCell>
          <Chip label={job.nrFailed} color='error' size='small'></Chip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ marginBottom: '2rem' }}>
              <Typography variant='body1' gutterBottom>
                Trades
              </Typography>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Strategy</TableCell>
                    <TableCell>Side</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>TP</TableCell>
                    <TableCell>SL</TableCell>
                    <TableCell>Job status</TableCell>
                    <TableCell>Trade status</TableCell>
                    <TableCell>Position status</TableCell>
                    <TableCell>PnL (if closed)</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {job.trades.map((placedTrade) => (
                    <TradeRow
                      key={placedTrade.client_id}
                      placedTrade={placedTrade}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
