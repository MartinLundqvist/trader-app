import {
  Alert,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { TraderHeader, TraderPaper } from '../../elements';
import { usePositions } from '../../hooks/usePositions';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { PositionRow } from './PositionRow';

const Positions = (): JSX.Element => {
  const { positions, isLoading, error } = usePositions();
  const { orders } = useOrders();
  const navigate = useNavigate();

  console.log(orders);

  const handleChartClick = (strategy: string, symbol: string) => {
    navigate(`/signals/${strategy}/${symbol}`);
  };

  return (
    <>
      <TraderHeader title='Positions' />
      <Grid container spacing={2}>
        {isLoading && <CircularProgress />}
        {error && <Alert severity='error'>{error.message}</Alert>}
        <TableContainer component={TraderPaper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Symbol</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Avg. entry price</TableCell>
                <TableCell>Current price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unrealized P/L (%)</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {positions &&
                positions.map((pos, index) => (
                  <PositionRow pos={pos} key={index} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default Positions;
