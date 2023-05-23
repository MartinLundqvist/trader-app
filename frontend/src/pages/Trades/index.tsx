import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTrades } from '../../contexts/TradesContext';
import { TraderPaper } from '../../elements';

const Trades = (): JSX.Element => {
  const { trades } = useTrades();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h5'>Trades</Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={TraderPaper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>TP</TableCell>
                <TableCell>SL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.symbol}>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>{trade.side}</TableCell>
                  <TableCell>{trade.qty}</TableCell>
                  <TableCell>{trade.take_profit.limit_price}</TableCell>
                  <TableCell>{trade.stop_loss.stop_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Trades;
