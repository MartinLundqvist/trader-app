import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
// import { useTrader } from '../contexts/TraderContext';
import { StrategyTickerData } from '@trader/types';
import { strategyTickerDataSchema } from '@trader/schemas';
import { useParams } from 'react-router';

const getTickerSignals = async ({ queryKey }: QueryFunctionContext) => {
  const [_, strategy, ticker] = queryKey;

  if (strategy === '' || ticker === '') return [];

  const url = import.meta.env.VITE_API_URL;

  const response = await fetch(`${url}/tickerdata/${strategy}/${ticker}`);

  if (!response.ok) throw new Error('Error calling API');

  const data = await response.json();

  const parsedData = strategyTickerDataSchema.safeParse(data);

  if (!parsedData.success) throw new Error('Error parsing response');

  return parsedData.data;
};

export const useTickerSignals = () => {
  const { strategy, ticker } = useParams();

  const { data, isLoading, error } = useQuery<StrategyTickerData, Error>({
    queryKey: ['signals', strategy, ticker],
    queryFn: getTickerSignals,
    networkMode: 'offlineFirst',
    enabled: !!strategy && !!ticker,
  });

  return { tickerSignals: data, isLoading, error };
};
