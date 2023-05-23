import {
  Alert,
  Box,
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material';
import { useTrades } from '../../contexts/TradesContext';
import { TraderPaper } from '../../elements';
import { useEffect, useState } from 'react';
import { usePlaceTrades } from '../../hooks/usePlaceTrades';

const Trades = (): JSX.Element => {
  const { trades, removeTrades, removeAllTrades } = useTrades();
  const { placeTrades, isLoading, isError, isSuccess, error, data } =
    usePlaceTrades();
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectOne = (symbol: string) => {
    if (isSelected(symbol)) {
      setSelected((prevSelected) => {
        const newSelection = prevSelected.filter(
          (prevSelection) => prevSelection !== symbol
        );
        return newSelection;
      });
    } else {
      setSelected((prevSelected) => [...prevSelected, symbol]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length < trades.length) {
      const all = trades.map((trade) => trade.symbol);
      setSelected(all);
    } else {
      setSelected([]);
    }
  };

  const handleRemove = () => {
    removeTrades(selected);
    setSelected([]);
  };

  const handleTradeClick = () => {
    placeTrades(trades);
  };

  const isSelected = (symbol: string) => {
    return selected.includes(symbol);
  };

  useEffect(() => {
    if (isSuccess) {
      removeAllTrades();
    }
  }, [isSuccess]);

  if (isLoading) return <Alert severity='info'>Placing trades</Alert>;
  if (isError)
    return (
      <Alert severity='error'>Error placing trades: {error?.message}</Alert>
    );
  if (isSuccess)
    return <Alert severity='success'>Success: {JSON.stringify(data)}</Alert>;

  return (
    <Grid container spacing={2} component={TraderPaper}>
      <Grid item xs={12}>
        <Typography variant='h5'>Trades</Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          {selected.length > 0 && (
            <Toolbar
              variant='dense'
              sx={{
                justifyContent: 'space-between',
              }}
            >
              <Typography>{selected.length} selected</Typography>

              <Button
                variant='contained'
                color='warning'
                onClick={handleRemove}
              >
                Remove
              </Button>
            </Toolbar>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={
                      trades.length > 0 && trades.length === selected.length
                    }
                  ></Checkbox>
                </TableCell>
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
                  <TableCell>
                    <Checkbox
                      onChange={() => handleSelectOne(trade.symbol)}
                      checked={isSelected(trade.symbol)}
                    ></Checkbox>
                  </TableCell>
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
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={handleTradeClick}>
            Place trades
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Trades;
