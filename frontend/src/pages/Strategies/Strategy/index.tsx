import { Strategy as StrategyType } from '@trader/types';
import { TraderCard } from '../../../elements';
import { useRefreshSignals } from '../../../hooks/useRefreshSignals';
import { useEffect, useState } from 'react';
import { getDaysDifference } from '../../../utils';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export const Strategy = ({
  strategy,
}: {
  strategy: StrategyType;
}): JSX.Element => {
  const {
    triggerRefresh,
    result,
    isLoading: isRefreshing,
    error: refreshError,
  } = useRefreshSignals();
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');

  const daysDifference = getDaysDifference(new Date(), strategy.last_run_date);

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

  return (
    <>
      <TraderCard>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography color='HighlightText' gutterBottom>
              Strategy: {strategy.name}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' component='span'>
                Last updated
              </Typography>
              <Chip label={`${daysDifference} days ago`} color='primary' />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body2' component='span'>
                # Signals
              </Typography>
              <Chip label={strategy.last_run_ticker_count} color='primary' />
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          {isRefreshing ? (
            <CircularProgress />
          ) : (
            <Button
              variant='contained'
              onClick={triggerRefresh}
              disabled={daysDifference === 0}
            >
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
