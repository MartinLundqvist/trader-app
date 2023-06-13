import { Button, Chip, TableCell, TableRow } from '@mui/material';
import { PlacedTrade } from '@trader/types';
import { useNavigate } from 'react-router-dom';

export const TradeRow = ({
  placedTrade,
}: {
  placedTrade: PlacedTrade;
}): JSX.Element => {
  const navigate = useNavigate();

  const handleChartClick = (strategy: string, symbol: string) => {
    navigate(`/signals/${strategy}/${symbol}`);
  };

  return (
    <TableRow>
      <TableCell>{placedTrade.symbol}</TableCell>
      <TableCell>{placedTrade.strategy}</TableCell>
      <TableCell>{placedTrade.side}</TableCell>
      <TableCell>{placedTrade.qty}</TableCell>
      <TableCell>{placedTrade.take_profit}</TableCell>
      <TableCell>{placedTrade.stop_loss}</TableCell>
      <TableCell>
        <StatusChip status={placedTrade.status} />
      </TableCell>
      <TableCell>{placedTrade.error}</TableCell>
      <TableCell>
        <Button
          onClick={() =>
            handleChartClick(placedTrade.strategy, placedTrade.symbol)
          }
        >
          Go to chart
        </Button>
      </TableCell>
    </TableRow>
  );
};
const StatusChip = ({
  status,
}: {
  status: PlacedTrade['status'];
}): JSX.Element => {
  if (status === 'successful') return <Chip label={status} color='success' />;
  if (status === 'failed') return <Chip label={status} color='error' />;

  return <Chip label={status} color='primary' />;
};
