import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Position } from '@trader/types';
import { useEffect, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { OrderRows } from './OrderRows';
import { useClosePosition } from '../../hooks/useClosePosition';

export const PositionRow = ({ pos }: { pos: Position }) => {
  const [open, setOpen] = useState(false);
  const [closePositionDialogOpen, setClosePositionDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleChartClick = (strategy: string, symbol: string) => {
    navigate(`/signals/${strategy}/${symbol}`);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{pos.symbol}</TableCell>
        <TableCell>{pos.side}</TableCell>
        <TableCell>{pos.avg_entry_price}</TableCell>
        <TableCell>{pos.current_price}</TableCell>
        <TableCell>{pos.qty}</TableCell>
        <TableCell>
          {pos.unrealized_pl} ({pos.unrealized_plpc?.toFixed(2)}%)
        </TableCell>
        <TableCell>
          {' '}
          <Button onClick={() => handleChartClick('conservative', pos.symbol)}>
            Go to chart
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={8}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ marginBottom: '2rem' }}>
              <Typography variant='body1' gutterBottom>
                Orders
              </Typography>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Created</TableCell>
                    <TableCell>Side</TableCell>
                    <TableCell>Limit Price</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <OrderRows symbol={pos.symbol} />
                </TableBody>
              </Table>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingTop: '1rem',
                }}
              >
                <Button
                  variant='contained'
                  color='warning'
                  onClick={() => setClosePositionDialogOpen(true)}
                >
                  Close position
                </Button>
              </Box>
            </Box>
            {closePositionDialogOpen && (
              <ClosePositionDialog
                symbol={pos.symbol}
                open={closePositionDialogOpen}
                setOpen={setClosePositionDialogOpen}
              />
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ClosePositionDialog = ({
  symbol,
  open,
  setOpen,
}: {
  symbol: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { closePosition, error, isLoading, isSuccess, isError } =
    useClosePosition();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  useEffect(() => {
    if (isError && error) {
      setAlertText(JSON.stringify(error.message));
      setOpenAlert(true);
    }

    if (isSuccess) {
      setAlertText('Position closed successfully');
      setOpenAlert(true);
    }
  }, [isError, error, isSuccess]);

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Close position for {symbol}</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          {isSuccess || isError ? (
            <Button variant='contained' onClick={() => setOpen(false)}>
              Close
            </Button>
          ) : (
            <>
              <Button
                disabled={isLoading || isSuccess || isError}
                variant='contained'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading || isSuccess || isError}
                variant='contained'
                color='warning'
                onClick={() => closePosition(symbol)}
              >
                Close it
              </Button>
            </>
          )}
        </DialogActions>
        {openAlert && (
          <Alert color={error ? 'error' : 'success'}>{alertText}</Alert>
        )}
      </Dialog>
    </>
  );
};
