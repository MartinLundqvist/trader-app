import {
  Alert,
  Button,
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

const Positions = (): JSX.Element => {
  const { positions, isLoading, error } = usePositions();
  const navigate = useNavigate();

  console.log(positions);

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
                  <TableRow key={index}>
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
                      <Button
                        onClick={() =>
                          handleChartClick('conservative', pos.symbol)
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
    </>
  );
};

export default Positions;
