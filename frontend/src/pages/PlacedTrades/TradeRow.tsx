import {
  Box,
  Button,
  Chip,
  CircularProgress,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Order, PlacedTrade } from '@trader/types';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { positionPnL, positionStatus } from '../../utils';
import { useLatestTradePrice } from '../../hooks/useLatestTradePrice';

export const TradeRow = ({
  placedTrade,
}: {
  placedTrade: PlacedTrade;
}): JSX.Element => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { latestTradePrice, isLoading } = useLatestTradePrice(
    placedTrade.symbol
  );

  const thisOrder = orders?.find(
    (order) => order.client_order_id === placedTrade.client_id
  );

  // console.log(latestTradePrice);

  const thisPositionStatus = thisOrder && positionStatus(thisOrder);
  const thisOrderPnL = thisOrder && positionPnL(thisOrder);

  const getPriceChange = () => {
    if (!thisOrder || !latestTradePrice) return null;

    if (thisOrder.status !== 'filled') return null;

    const priceChange =
      ((Number(latestTradePrice) - Number(thisOrder.filled_avg_price)) /
        Number(thisOrder.filled_avg_price)) *
      100;

    return priceChange.toFixed(2);
  };

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
        <JobStatusChip status={placedTrade.status} title={placedTrade.error} />
      </TableCell>
      <TableCell>
        <TradeStatusChip status={thisOrder?.status} />
      </TableCell>
      <TableCell>
        {thisOrder?.status === 'filled' &&
          new Date(thisOrder?.filled_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {thisOrder?.status === 'filled' &&
          thisOrder?.filled_avg_price.toFixed(2)}
      </TableCell>
      <TableCell>
        <OrderStatusChip status={thisPositionStatus} />
      </TableCell>
      <TableCell>
        {isLoading ? (
          <CircularProgress size='1rem' />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getPriceChange() && Number(getPriceChange()) > 0 ? (
              <ArrowDropUp color='success' />
            ) : (
              <ArrowDropDown color='error' />
            )}
            {getPriceChange()}%
          </Box>
        )}
      </TableCell>
      {/* <TableCell>{thisOrder && thisOrder.status}</TableCell>
      <TableCell>{thisOrderClosed ? 'Closed' : 'Open'}</TableCell> */}
      <TableCell>
        {thisPositionStatus === 'closed' && thisOrderPnL ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {Number(thisOrderPnL.absolute) > 0 ? (
              <ArrowDropUp color='success' />
            ) : (
              <ArrowDropDown color='error' />
            )}
            {thisOrderPnL.absolute} ({thisOrderPnL.percent}%)
          </Box>
        ) : (
          'N/A'
        )}
      </TableCell>
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

const JobStatusChip = ({
  status,
  title,
}: {
  status: PlacedTrade['status'];
  title: string | null;
}): JSX.Element => {
  return (
    <Tooltip title={title}>
      <span>
        {status === 'successful' && <Chip label={status} color='success' />}
        {status === 'failed' && <Chip label={status} color='error' />}
        {status !== 'successful' && status !== 'failed' && (
          <Chip label={status} color='primary' />
        )}
      </span>
    </Tooltip>
  );
};

const TradeStatusChip = ({
  status,
}: {
  status?: Order['status'];
}): JSX.Element => {
  return (
    <span>
      {status === 'filled' && <Chip label={status} color='success' />}
      {status === 'canceled' && <Chip label={status} color='error' />}
      {status !== 'filled' && status !== 'canceled' && (
        <Chip label={status} color='primary' />
      )}
    </span>
  );
};
const OrderStatusChip = ({
  status,
}: {
  status?: 'open' | 'closed';
}): JSX.Element => {
  return (
    <span>
      {status === 'open' && <Chip label={status} color='primary' />}
      {status === 'closed' && <Chip label={status} color='success' />}
    </span>
  );
};
