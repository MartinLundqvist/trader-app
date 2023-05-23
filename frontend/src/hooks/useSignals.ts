import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useTrader } from '../contexts/TraderContext';
import { StrategySignals } from '@trader/types';
import { strategySignalsSchema } from '@trader/schemas';

// TODO: Refactor to the same pattern as useStrategies and useTickerSignals
const getSignals = async ({ queryKey }: QueryFunctionContext) => {
  const [_, strategy] = queryKey;

  if (strategy === '') return [];

  const url = import.meta.env.VITE_API_URL;

  const response = await fetch(`${url}/signals/${strategy}`);
  if (!response.ok) throw new Error('Error calling API');
  const data = await response.json();
  const parsedData = strategySignalsSchema.parse(data);

  // console.log(data);

  return parsedData;
};

export const useSignals = () => {
  // const queryClient = useQueryClient();
  const { strategy, ticker } = useTrader();

  const { error, data, isLoading } = useQuery<StrategySignals, Error>({
    queryKey: ['signals', strategy],
    queryFn: getSignals,
  });

  const currentSignal =
    ticker !== ''
      ? data?.find((signal) => signal.symbol === ticker) || null
      : null;

  // console.log(currentSignal);

  return { currentSignal, signals: data, isLoading, error };
};
