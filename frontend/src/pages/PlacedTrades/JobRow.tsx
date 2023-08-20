import {
  Box,
  Chip,
  Collapse,
  Grid,
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
import { AccountCard } from '../Trades/AccountCard';
import { useOrders } from '../../hooks/useOrders';
import {
  nrProfitableOrders,
  positionStatus,
  totalAquisitionCost,
  totalProfit,
} from '../../utils';
import { Order } from '@trader/types';

export const JobRow = ({ job }: { job: PlacedTradeJob }): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { orders } = useOrders();

  const _theseOrders =
    orders &&
    job.trades.map((trade) => {
      return orders.find((order) => order.client_order_id === trade.client_id);
    });

  const theseOrders = _theseOrders?.reduce((acc: Order[], value) => {
    if (value) {
      acc.push(value);
    }
    return acc;
  }, []);

  const _closedOrders =
    theseOrders &&
    theseOrders.map((order) => {
      if (positionStatus(order!) === 'closed') {
        return order;
      }
    });

  const closedOrders = _closedOrders?.reduce((acc: Order[], value) => {
    if (value) {
      acc.push(value);
    }
    return acc;
  }, []);

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
              <Grid container spacing={2} marginTop={1} marginBottom={1}>
                <Grid item xs={4}>
                  <AccountCard
                    caption='Trades closed out of total'
                    value={
                      (closedOrders?.length.toString() ?? '-') +
                      ' / ' +
                      job.trades.length.toString()
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard
                    caption='Profitable trades out of closed'
                    value={
                      (closedOrders
                        ? nrProfitableOrders(closedOrders).toString()
                        : '-') +
                      ' / ' +
                      (closedOrders?.length.toString() ?? '-')
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard
                    caption='Profit and loss'
                    value={
                      closedOrders
                        ? totalProfit(closedOrders).toLocaleString() +
                          ' / ' +
                          totalAquisitionCost(closedOrders).toLocaleString() +
                          ' (' +
                          (
                            (totalProfit(closedOrders) /
                              totalAquisitionCost(closedOrders)) *
                            100
                          ).toFixed(2) +
                          '%)'
                        : '-'
                    }
                  />
                </Grid>
              </Grid>
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
