import { useQuery } from '@tanstack/react-query';
import { strategiesSchema } from '@trader/schemas';
import { Strategies } from '@trader/types';
import { useTrader } from '../contexts/TraderContext';

const getStrategies = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/strategies`);

  if (!response.ok) throw new Error('Error calling API');

  const data = await response.json();

  // console.log(data);

  const parsed = strategiesSchema.safeParse(data);

  if (!parsed.success) throw new Error('Error parsing response');

  return parsed.data;
};

export const useStrategies = () => {
  const { strategy } = useTrader();
  const { error, data, isLoading } = useQuery<Strategies, Error>({
    queryKey: ['strategies'],
    queryFn: getStrategies,
    networkMode: 'offlineFirst',
  });

  const currentStrategy = data?.find((s) => s.name === strategy) || null;

  return { currentStrategy, strategies: data, isLoading, error };
};
