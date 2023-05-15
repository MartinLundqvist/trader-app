import CardContent from '@mui/material/CardContent';
import { TraderCard } from '../../../elements';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { getDaysDifference } from '../../../utils';
import { useMarketDataInformation } from '../../../hooks/useMarketDataInformation';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useRefreshMarketData } from '../../../hooks/useRefreshMarketData';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';

export const MarketData = (): JSX.Element => {
  const { marketDataInformation, isLoading, error } =
    useMarketDataInformation();
  const {
    triggerRefresh,
    result,
    isLoading: isRefreshing,
    error: refreshError,
  } = useRefreshMarketData();

  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (result) {
      console.log(result);
      setMessage(result.message);
      setOpenDialog(true);
    }
    if (refreshError) {
      console.log(refreshError);
      setMessage(refreshError.message);
      setOpenDialog(true);
    }
  }, [result, refreshError]);

  if (isLoading) return <CircularProgress />;

  if (error) return <Alert severity='error'>Error: {error.message}</Alert>;

  if (!marketDataInformation)
    return <Alert severity='warning'>No market data found</Alert>;

  return (
    <>
      <TraderCard>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography color='HighlightText' gutterBottom>
              Marketdata
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' component='span'>
                Last updated
              </Typography>
              <Chip
                label={`${getDaysDifference(
                  new Date(),
                  marketDataInformation.last_updated
                )} days ago`}
                color='primary'
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' component='span'>
                # Tickers
              </Typography>
              <Chip
                label={marketDataInformation.number_of_symbols}
                color='primary'
              />
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          {isRefreshing ? (
            <CircularProgress />
          ) : (
            <Button variant='contained' onClick={triggerRefresh}>
              Refresh data
            </Button>
          )}
        </CardActions>
      </TraderCard>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Refresh result</DialogTitle>
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
