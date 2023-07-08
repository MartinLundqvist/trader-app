import { useQuery } from '@tanstack/react-query';
import { Order } from '@trader/types';

const getOrders = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/orders`);

  if (!response.ok) {
    throw new Error('Error calling account API');
  }

  const data = await response.json();

  // const parsedData = jobsResponseSchema.safeParse(data);

  // if (!parsedData.success) throw new Error(parsedData.error.message);

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
