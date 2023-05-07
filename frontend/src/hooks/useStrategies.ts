import { useQuery } from '@tanstack/react-query';
import { strategiesSchema } from '@trader/schemas';
import { Strategies } from '@trader/types';
import { useTrader } from '../contexts/TraderContext';

const getStrategies = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/strategies`);

  if (!response.ok) return Promise.reject(new Error('Error calling API'));

  const data = await response.json();

  const parsed = strategiesSchema.parse(data);

  return parsed;
};

export const useStrategies = () => {
  const { strategy } = useTrader();
  const { error, data, isLoading } = useQuery<Strategies, Error>({
    queryKey: ['strategies'],
    queryFn: getStrategies,
  });

  const currentStrategy = data?.find((s) => s.name === strategy) || null;

  return { currentStrategy, strategies: data, isLoading, error };
};
