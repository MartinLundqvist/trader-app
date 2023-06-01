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
import { TraderCard, TraderHeader, TraderPaper } from '../../elements';
import { useEffect, useState } from 'react';
import { usePlaceTrades } from '../../hooks/usePlaceTrades';
import { Link, useNavigate } from 'react-router-dom';
import { getMaintenanceMargin } from '../../utils';
import { useAccount } from '../../hooks/useAccount';
import { AccountCard } from './AccountCard';

const Trades = (): JSX.Element => {
  const { trades, removeTrades, removeAllTrades } = useTrades();
  const { placeTrades, isLoading, isError, isSuccess, error, data } =
    usePlaceTrades();
  const { account } = useAccount();
  const [selected, setSelected] = useState<string[]>([]);

  const navigate = useNavigate();

  console.log(account);

  const totalPosition = trades.reduce((acc, trade) => {
    return acc + trade.qty * trade.limit;
  }, 0);

  const totalMaintenanceMargin = trades.reduce((acc, trade) => {
    return acc + getMaintenanceMargin(trade);
  }, 0);

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
        <Grid item xs={3}>
          <AccountCard
            caption='Buying power'
            value={`$ ${account?.buying_power}`}
          />
        </Grid>
        <Grid item xs={3}>
          <AccountCard caption='Cash' value={`$ ${account?.cash}`} />
        </Grid>
        <Grid item xs={3}>
          <AccountCard
            caption='Maintenance margin'
            value={`$ ${account?.maintenance_margin}`}
          />
        </Grid>
        <Grid item xs={3}>
          <AccountCard
            caption='Portfolio value'
            value={`$ ${account?.portfolio_value}`}
          />
        </Grid>
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
                  <TableCell>Position size</TableCell>
                  <TableCell>Maint. margin</TableCell>
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
                      $ {Number(trade.limit * trade.qty).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      $ {Number(getMaintenanceMargin(trade)).toFixed(2)}
                    </TableCell>
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
                <TableRow>
                  <TableCell colSpan={8}>Total</TableCell>
                  <TableCell>$ {Number(totalPosition).toFixed(2)}</TableCell>
                  <TableCell>
                    $ {Number(totalMaintenanceMargin).toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
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
