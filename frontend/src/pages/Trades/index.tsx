import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTrades } from '../../contexts/TradesContext';
import { TraderHeader, TraderPaper } from '../../elements';
import { useEffect, useState } from 'react';
import { usePlaceTrades } from '../../hooks/usePlaceTrades';
import { useNavigate } from 'react-router-dom';
import { getMaintenanceMargin, getPositionSize } from '../../utils';
import { useAccount } from '../../hooks/useAccount';
import { AccountCard } from './AccountCard';
import { Trade } from '@trader/types';

const Trades = (): JSX.Element => {
  const { trades, removeTrades, removeAllTrades, updateTrade } = useTrades();
  const { placeTrades, isLoading, error, result } = usePlaceTrades();
  const { account, error: accountError } = useAccount();
  const [selected, setSelected] = useState<string[]>([]);
  const [shareOfBP, setShareOfBP] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // console.log(account);

  const totalPosition = trades.reduce((acc, trade) => {
    return acc + getPositionSize(trade);
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

  const handleQtyChange = (
    trade: Trade,
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const qty = Number(evt.target.value);
    updateTrade(trade.symbol, { ...trade, qty });
  };

  const handleApplyClick = () => {
    const positionPerTrade =
      ((account?.buying_power || 0) * shareOfBP) / 100 / trades.length;
    // console.log(positionPerTrade);
    trades.forEach((trade) => {
      const qty = Math.floor(positionPerTrade / trade.limit);
      updateTrade(trade.symbol, { ...trade, qty });
    });
  };

  const handleClearClick = () => {
    trades.forEach((trade) => {
      updateTrade(trade.symbol, { ...trade, qty: 0 });
    });

    setShareOfBP(0);
  };

  useEffect(() => {
    if (result) {
      removeAllTrades();
      setOpenDialog(true);
      setMessage(result.message);
    }
    if (error) {
      setOpenDialog(true);
      setMessage(error.message);
    }
  }, [result, error]);

  if (isLoading) return <Alert severity='info'>Placing trades</Alert>;
  // if (isError)
  //   return (
  //     <Alert severity='error'>Error placing trades: {error?.message}</Alert>
  //   );
  // if (isSuccess)
  //   return <Alert severity='success'>Success: {JSON.stringify(data)}</Alert>;

  return (
    <>
      <TraderHeader title='Manage and place new trades' />
      {/* <Grid container spacing={2} component={TraderPaper}> */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <AccountCard
            caption='Buying power'
            value={`$ ${account?.buying_power}`}
            error={accountError}
          />
        </Grid>
        <Grid item xs={4}>
          <AccountCard
            caption='Cash'
            value={`$ ${account?.cash}`}
            error={accountError}
          />
        </Grid>
        <Grid item xs={4}>
          <AccountCard
            caption='Maintenance margin'
            value={`$ ${account?.maintenance_margin}`}
            error={accountError}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
          <Typography variant='h6'>Bulk allocation</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
        >
          <TextField
            id='share'
            label='% of buying power'
            type='number'
            value={shareOfBP}
            onChange={(evt) => setShareOfBP(Number(evt.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>%</InputAdornment>
              ),
            }}
          />
          <Button
            variant='contained'
            color='warning'
            onClick={handleClearClick}
          >
            Clear
          </Button>
          <Button variant='contained' onClick={handleApplyClick}>
            Apply
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
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
            <Table size='small'>
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
                    <TableCell>
                      <TextField
                        id='qty'
                        type='number'
                        label='Quantity'
                        value={trade.qty}
                        onChange={(evt) => handleQtyChange(trade, evt)}
                      ></TextField>
                    </TableCell>
                    <TableCell>{trade.take_profit}</TableCell>
                    <TableCell>{trade.stop_loss}</TableCell>
                    <TableCell>{trade.limit}</TableCell>
                    <TableCell>
                      $ {Number(getPositionSize(trade)).toFixed(2)} (
                      {(
                        Number(getPositionSize(trade) / totalPosition) * 100
                      ).toFixed(0)}
                      %)
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

        <Grid item xs={4}>
          <AccountCard
            caption='Buying power after'
            value={`$ ${Number(
              (account?.buying_power || 0) - totalPosition
            ).toFixed(2)} (-${Number(
              (totalPosition / (account?.buying_power || 1)) * 100
            ).toFixed(1)}%)`}
            error={accountError}
          />
        </Grid>
        <Grid item xs={4}>
          <AccountCard
            caption='Cash after'
            value={`$ ${Number((account?.cash || 0) - totalPosition).toFixed(
              2
            )} (-${Number((totalPosition / (account?.cash || 1)) * 100).toFixed(
              1
            )}%)`}
            error={accountError}
          />
        </Grid>
        <Grid item xs={4}>
          <AccountCard
            caption='Maintenance margin after'
            value={`$ ${Number(
              (account?.maintenance_margin || 0) + totalMaintenanceMargin
            ).toFixed(2)} (${Number(
              (totalMaintenanceMargin / (account?.maintenance_margin || 1)) *
                100
            ).toFixed(1)}%)`}
            error={accountError}
          />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
            }}
          >
            <Button variant='contained' onClick={handleTradeClick}>
              Place trades
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Refresh status</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => setOpenDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Trades;
