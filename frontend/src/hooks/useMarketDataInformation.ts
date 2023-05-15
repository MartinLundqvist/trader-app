import { useQuery } from '@tanstack/react-query';
import { MarketDataInformation } from '@trader/types';
import { marketDataInformationSchema } from '@trader/schemas';

const getMarketDataInformation = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/marketdata/information`);

  if (!response.ok) return Promise.reject(new Error('Error calling API'));

  const data = await response.json();

  const parsed = marketDataInformationSchema.parse(data);

  return parsed;
};

export const useMarketDataInformation = () => {
  const { error, data, isLoading } = useQuery<MarketDataInformation, Error>({
    queryKey: ['marketdatainformation'],
    queryFn: getMarketDataInformation,
  });

  return { marketDataInformation: data, isLoading, error };
};
