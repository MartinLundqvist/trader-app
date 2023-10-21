import { useQuery } from '@tanstack/react-query';
import { Order } from '@trader/types';

const getOrders = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/orders`);

  if (!response.ok) {
    throw new Error('Error calling account API');
  }

  // TODO: Add schema validation
  const data = await response.json();

  return data;
};

export const useOrders = () => {
  const { data, error, isError, isLoading } = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: getOrders,
    networkMode: 'offlineFirst',
  });

  return { orders: data, error, isError, isLoading };
};
