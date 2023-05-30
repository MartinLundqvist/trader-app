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
} from '@mui/material';
import { useTrades } from '../../contexts/TradesContext';
import { TraderHeader, TraderPaper } from '../../elements';
import { useEffect, useState } from 'react';
import { usePlaceTrades } from '../../hooks/usePlaceTrades';
import { Link, useNavigate } from 'react-router-dom';

const Trades = (): JSX.Element => {
  const { trades, removeTrades, removeAllTrades } = useTrades();
  const { placeTrades, isLoading, isError, isSuccess, error, data } =
    usePlaceTrades();
  const [selected, setSelected] = useState<string[]>([]);

  const navigate = useNavigate();

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

  const handleChartClick = (strategy: string, symbol: string) => {
    navigate(`/signals/${strategy}/${symbol}`);
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
    <>
      <TraderHeader title='Manage trades' />
      {/* <Grid container spacing={2} component={TraderPaper}> */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={TraderPaper}>
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
                  <TableCell>Strategy</TableCell>
                  <TableCell>Side</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>TP</TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Latest</TableCell>
                  <TableCell />
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
                    <TableCell>{trade.strategy}</TableCell>
                    <TableCell>{trade.side}</TableCell>
                    <TableCell>{trade.qty}</TableCell>
                    <TableCell>{trade.take_profit}</TableCell>
                    <TableCell>{trade.stop_loss}</TableCell>
                    <TableCell>{trade.limit}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleChartClick(trade.strategy, trade.symbol)
                        }
                      >
                        Go to chart
                      </Button>
                    </TableCell>
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
    </>
  );
};

export default Trades;
