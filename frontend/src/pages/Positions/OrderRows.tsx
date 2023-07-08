import { TableCell, TableRow } from '@mui/material';
import { useOrders } from '../../hooks/useOrders';
import { useMemo } from 'react';
import { getDaysDifference } from '../../utils';

export const OrderRows = ({ symbol }: { symbol: string }) => {
  const { orders } = useOrders();

  const symbolOrders = useMemo(
    () => orders?.filter((order) => order.symbol === symbol),
    [symbol, orders]
  );

  if (!symbolOrders) {
    return null;
  }

  return (
    <>
      {symbolOrders.map((order, index) => (
        <TableRow key={index}>
          <TableCell>
            {getDaysDifference(new Date(), new Date(order.created_at))} days ago
          </TableCell>
          <TableCell>{order.side}</TableCell>
          <TableCell>{order.limit_price}</TableCell>
          <TableCell>{order.status}</TableCell>
        </TableRow>
      ))}
    </>
  );
};
